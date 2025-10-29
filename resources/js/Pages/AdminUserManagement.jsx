import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthificatedLayoutAdmin";
import axios from "axios";
import { router, Head } from "@inertiajs/react";
import Loader   from "@/Components/Spinner";
import Swal from "sweetalert2";
import { Link, usePage } from "@inertiajs/react";

const AdminUserManagement = () => {
    const { userId } = usePage().props;

    const [user, setUser] = useState(null);
    const [loyaltyLevels, setLoyaltyLevels] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState({ message: "", type: "" });
    const [activeTab, setActiveTab] = useState("profile");
    const [pointsError, setPointsError] = useState("");
    const TRANSACTIONS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [allTransactions, setAllTransactions] = useState([]); 
    const [displayedTransactions, setDisplayedTransactions] = useState([]); 

    // Form states
    const [profileForm, setProfileForm] = useState({
        name: "",
        email: "",
        telephone: "",
        birth_date: "",
        loyalty_level_id: "",
        points_balance: 0,
    });

    const [pointsForm, setPointsForm] = useState({
        points_transaction: 0,
        reason: "",
    });

    // Fetch user data, loyalty levels, and transaction history
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userResponse, levelsResponse, transactionsResponse] =
                    await Promise.all([
                        axios.get(`/admin/users/${userId}`),
                        axios.get("/admin/loyalty-levels"),
                        axios.get(`/admin/users/${userId}/transactions`), // API retourne toutes les transactions
                    ]);

                const userData = userResponse.data;
                setUser(userData);
                setProfileForm({
                    name: userData.name,
                    email: userData.email,
                    telephone: userData.telephone || "",
                    birth_date: userData.birth_date
                        ? userData.birth_date.split("T")[0]
                        : "",
                    loyalty_level_id: userData.loyalty_level_id,
                    points_balance: userData.points_balance,
                });

                setLoyaltyLevels(levelsResponse.data);
                setAllTransactions(
                    transactionsResponse.data.transactions || []
                );
                setLoading(false);
            } catch (err) {
                setError("Failed to load user data");
                setLoading(false);
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [userId]);

    useEffect(() => {
        // Calculer les transactions à afficher pour la page courante
        const indexOfLastTransaction = currentPage * TRANSACTIONS_PER_PAGE;
        const indexOfFirstTransaction =
            indexOfLastTransaction - TRANSACTIONS_PER_PAGE;
        setDisplayedTransactions(
            allTransactions.slice(
                indexOfFirstTransaction,
                indexOfLastTransaction
            )
        );
    }, [currentPage, allTransactions]);

    // Handle profile form input changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle points form input changes
    const handlePointsChange = (e) => {
        const { name, value } = e.target;
        setPointsForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update user profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `/admin/users/${userId}`,
                profileForm
            );
            setUser(response.data);
            setActionStatus({
                message: "User profile updated successfully",
                type: "success",
            });

            // Clear status message after 3 seconds
            setTimeout(() => {
                setActionStatus({ message: "", type: "" });
            }, 3000);
        } catch (err) {
            setActionStatus({
                message: "Failed to update user profile",
                type: "error",
            });
            console.error("Error updating user:", err);
        }
    };

    // Add points transaction
    const handleAddPoints = async (e) => {
        e.preventDefault();

        // Validation côté client
        if (pointsForm.points_transaction === 0) {
            setPointsError("La valeur ne peut pas être zéro");
            return;
        }

        if (pointsForm.points_transaction < 0) {
            setPointsError("La valeur ne peut pas être négative");
            return;
        }

        try {
            const response = await axios.post(
                `/admin/users/${userId}/transactions`,
                pointsForm
            );

            // Update user data and transaction history
            setUser((prev) => ({
                ...prev,
                points_balance:
                    prev.points_balance +
                    parseInt(pointsForm.points_transaction),
            }));

            // Refresh transaction history
            const transactionsResponse = await axios.get(
                `/admin/users/${userId}/transactions`
            );
            setTransactions(transactionsResponse.data.transactions);

            // Reset form
            setPointsForm({
                points_transaction: 0,
                reason: "",
            });

            setActionStatus({
                message: "Points transaction completed successfully",
                type: "success",
            });

            // Clear status message after 3 seconds
            setTimeout(() => {
                setActionStatus({ message: "", type: "" });
            }, 3000);
            setPointsError("");
        } catch (err) {
            // Gérer les erreurs de validation du serveur
            if (err.response && err.response.data.errors) {
                setPointsError(err.response.data.errors.points_transaction[0]);
            } else {
                setActionStatus({
                    message: "Failed to complete points transaction",
                    type: "error",
                });
            }
        }
    };

    const handleDeleteUser = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this user? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/admin/users/${userId}`);

                await Swal.fire({
                    title: "Deleted!",
                    text: "User has been deleted successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setActionStatus({
                    message: "User deleted successfully",
                    type: "success",
                });

                setTimeout(() => {
                    router.visit("/admin/users");
                }, 1500);
            } catch (err) {
                await Swal.fire({
                    title: "Error!",
                    text: "Failed to delete user",
                    icon: "error",
                });

                setActionStatus({
                    message: "Failed to delete user",
                    type: "error",
                });
                console.error("Error deleting user:", err);
            }
        }
    };

    if (loading)
        return (
            <div
                style={{
                    marginTop: "150px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Loader />
            </div>
        );
    if (error)
        return <div className="text-center p-8 text-red-600">{error}</div>;
    if (!user) return <div className="text-center p-8">User not found</div>;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit user{" "}
                </h2>
            }
        >
            <Head title="Editing" />
            <>
                {user.role !== "admin" ? (
                    <div className="container mx-auto p-6">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    User Management: {user.name}
                                </h1>
                                <p className="text-gray-600">
                                    User ID: {user.id}
                                </p>
                            </div>
                            <div>
                                <Link href={`/admin/users`}>
                                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">
                                        Back to Users
                                    </button>
                                </Link>
                                <button
                                    onClick={handleDeleteUser}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>

                        {/* Status message */}
                        {actionStatus.message && (
                            <div
                                className={`p-4 mb-6 rounded ${
                                    actionStatus.type === "success"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {actionStatus.message}
                            </div>
                        )}

                        {/* Tab navigation */}
                        <div className="border-b border-gray-200 mb-6">
                            <ul className="flex flex-wrap -mb-px">
                                <li className="mr-2">
                                    <button
                                        onClick={() => setActiveTab("profile")}
                                        className={`inline-block p-4 rounded-t-lg ${
                                            activeTab === "profile"
                                                ? "border-b-2 border-orange-600 text-orange-600"
                                                : "border-b-2 border-transparent hover:text-orange-600 hover:border-orange-300"
                                        }`}
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        onClick={() => setActiveTab("points")}
                                        className={`inline-block p-4 rounded-t-lg ${
                                            activeTab === "points"
                                                ? "border-b-2 border-orange-600 text-orange-600"
                                                : "border-b-2 border-transparent hover:text-orange-600 hover:border-orange-300"
                                        }`}
                                    >
                                        Points Management
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        onClick={() => setActiveTab("history")}
                                        className={`inline-block p-4 rounded-t-lg ${
                                            activeTab === "history"
                                                ? "border-b-2 border-orange-600 text-orange-600"
                                                : "border-b-2 border-transparent hover:text-orange-600 hover:border-orange-300"
                                        }`}
                                    >
                                        Transaction History
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Tab content */}
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {/* Profile Edit Tab */}
                            {activeTab === "profile" && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        Edit User Profile
                                    </h2>
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={profileForm.name}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileForm.email}
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Telephone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="telephone"
                                                    value={
                                                        profileForm.telephone
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Birth Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="birth_date"
                                                    value={
                                                        profileForm.birth_date
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Loyalty Level
                                                </label>
                                                <select
                                                    name="loyalty_level_id"
                                                    value={
                                                        profileForm.loyalty_level_id
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                >
                                                    {loyaltyLevels.map(
                                                        (level) => (
                                                            <option
                                                                key={level.id}
                                                                value={level.id}
                                                            >
                                                                {
                                                                    level.name_loyalty
                                                                }{" "}
                                                                (Min Points:{" "}
                                                                {
                                                                    level.min_points
                                                                }
                                                                )
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Points Balance (Direct Edit)
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    name="points_balance"
                                                    value={
                                                        profileForm.points_balance
                                                    }
                                                    onChange={
                                                        handleProfileChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    required
                                                />
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Use with caution: Direct
                                                    edits won't create
                                                    transaction records
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                Update Profile
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Points Management Tab */}
                            {activeTab === "points" && (
                                <div>
                                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                                        <h3 className="text-lg font-medium">
                                            Current Points Balance
                                        </h3>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {user.points_balance}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Current Loyalty Level:{" "}
                                            {loyaltyLevels.find(
                                                (level) =>
                                                    level.id ===
                                                    user.loyalty_level_id
                                            )?.name_loyalty || "N/A"}
                                        </p>
                                    </div>

                                    <h2 className="text-xl font-semibold mb-4">
                                        Add/Deduct Points
                                    </h2>
                                    <form onSubmit={handleAddPoints}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Points to Add/Deduct
                                                </label>
                                                <input
                                                    type="number"
                                                    name="points_transaction"
                                                    min="1" // Empêche les valeurs négatives dans l'input
                                                    value={
                                                        pointsForm.points_transaction
                                                    }
                                                    onChange={(e) => {
                                                        handlePointsChange(e);
                                                        if (pointsError)
                                                            setPointsError("");
                                                    }}
                                                    className={`w-full px-3 py-2 border ${
                                                        pointsError
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                    } rounded-md`}
                                                    required
                                                />
                                                {pointsError && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {pointsError}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Reason
                                                </label>
                                                <input
                                                    type="text"
                                                    name="reason"
                                                    value={pointsForm.reason}
                                                    onChange={
                                                        handlePointsChange
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="e.g., Purchase, Registration bonus, Reward redemption"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                            >
                                                Process Transaction
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Transaction History Tab */}
                            {activeTab === "history" && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4">
                                        Transaction History
                                    </h2>

                                    {allTransactions.length === 0 ? (
                                        <p className="text-gray-500 py-4">
                                            No transaction history found for
                                            this user.
                                        </p>
                                    ) : (
                                        <>
                                            <div className="overflow-x-auto mb-4">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Date
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Points
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Reason
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Transaction ID
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {displayedTransactions.map(
                                                            (transaction) => (
                                                                <tr
                                                                    key={
                                                                        transaction.id
                                                                    }
                                                                >
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        {new Date(
                                                                            transaction.created_at
                                                                        ).toLocaleString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span
                                                                            className={`font-medium ${
                                                                                transaction.points_transaction >
                                                                                0
                                                                                    ? "text-green-600"
                                                                                    : "text-red-600"
                                                                            }`}
                                                                        >
                                                                            {transaction.points_transaction >
                                                                            0
                                                                                ? "+"
                                                                                : ""}
                                                                            {
                                                                                transaction.points_transaction
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        {
                                                                            transaction.reason
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                                        {
                                                                            transaction.id
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination */}
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-sm text-gray-700">
                                                    Showing{" "}
                                                    <span className="font-medium">
                                                        {(currentPage - 1) *
                                                            TRANSACTIONS_PER_PAGE +
                                                            1}
                                                    </span>{" "}
                                                    to{" "}
                                                    <span className="font-medium">
                                                        {Math.min(
                                                            currentPage *
                                                                TRANSACTIONS_PER_PAGE,
                                                            allTransactions.length
                                                        )}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="font-medium">
                                                        {allTransactions.length}
                                                    </span>{" "}
                                                    transactions
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                (prev) =>
                                                                    Math.max(
                                                                        prev -
                                                                            1,
                                                                        1
                                                                    )
                                                            )
                                                        }
                                                        disabled={
                                                            currentPage === 1
                                                        }
                                                        className={`px-3 py-1 rounded-md ${
                                                            currentPage === 1
                                                                ? "bg-gray-200 cursor-not-allowed"
                                                                : "bg-orange-500 text-white hover:bg-orange-600"
                                                        }`}
                                                    >
                                                        Previous
                                                    </button>
                                                    {Array.from({
                                                        length: Math.ceil(
                                                            allTransactions.length /
                                                                TRANSACTIONS_PER_PAGE
                                                        ),
                                                    }).map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    index + 1
                                                                )
                                                            }
                                                            className={`px-3 py-1 rounded-md ${
                                                                currentPage ===
                                                                index + 1
                                                                    ? "bg-blue-600 text-white"
                                                                    : "bg-orange-500 text-white hover:bg-orange-600"
                                                            }`}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    ))}
                                                    <button
                                                        onClick={() =>
                                                            setCurrentPage(
                                                                (prev) =>
                                                                    Math.min(
                                                                        prev +
                                                                            1,
                                                                        Math.ceil(
                                                                            allTransactions.length /
                                                                                TRANSACTIONS_PER_PAGE
                                                                        )
                                                                    )
                                                            )
                                                        }
                                                        disabled={
                                                            currentPage ===
                                                            Math.ceil(
                                                                allTransactions.length /
                                                                    TRANSACTIONS_PER_PAGE
                                                            )
                                                        }
                                                        className={`px-3 py-1 rounded-md ${
                                                            currentPage ===
                                                            Math.ceil(
                                                                allTransactions.length /
                                                                    TRANSACTIONS_PER_PAGE
                                                            )
                                                                ? "bg-gray-200 cursor-not-allowed"
                                                                : "bg-orange-500 text-white hover:bg-orange-600"
                                                        }`}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            color: "#721c24",
                            backgroundColor: "#f8d7da",
                            border: "1px solid #f5c6cb",
                            padding: "10px 15px",
                            borderRadius: "4px",
                            margin: "250px 0",
                            fontSize: "16px",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        This page require a higher rank to access
                    </div>
                )}
            </>
        </AuthenticatedLayout>
    );
};

export default AdminUserManagement;
