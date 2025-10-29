import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthificatedLayoutAdmin";
import Loader from "@/Components/Spinner";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
export default function GestionUsers() {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetshDate = async () => {
            const response = await axios.get("/api/getUsers");
            setUsers(response.data.filter((user) => user.role == "user"));
            setAdmins(response.data.filter((admin) => admin.role == "admin"));
            setLoading(false);
            console.log(response.data);
        };
        fetshDate();
    }, []);

    const clickediconDelete = async (id) => {
        console.log(id);

        // Show confirmation dialog
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        // If user confirms deletion
        if (result.isConfirmed) {
            try {
                const res = await axios.delete("/admin/deleteUser", {
                    data: {
                        id: id,
                    },
                });

                if (res.data.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success",
                    });
                    setUsers(users.filter((user) => user.id !== id));
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: res.data.message,
                        icon: "error",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while deleting the user.",
                    icon: "error",
                });
                console.error("Delete error:", error);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return `----/--/--`;
        }
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${year}/${month}/${day}`;
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users Data
                </h2>
            }
        >
            <Head title="Users" />
            {loading ? (
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
            ) : (
                <>
                    <div className="p-6">
                        {" "}
                        <h2 className="text-2xl font-bold mb-4">admins</h2>
                        <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl">
                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <tr>
                                    <th className="py-3 px-6 text-center">
                                        Name
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        Email
                                    </th>

                                    <th className="py-3 px-6 text-center">
                                        Balance
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        Birth Date (yyyy/mm/dd)
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        telephone
                                    </th>
                                    <th className="py-3 px-6 text-center">
                                        role
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {admins.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="py-3 px-6 text-center">
                                            {user.name}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {user.email}
                                        </td>

                                        <td className="py-3 px-6 text-center">
                                            {user.points_balance}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {formatDate(user.birth_date)}{" "}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {user.telephone}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            {user.role}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>{" "}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Users</h2>
                        <>
                            <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl">
                                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <tr>
                                        <th className="py-3 px-6 text-center">
                                            ID
                                        </th>
                                        <th className="py-3 px-6 text-center">
                                            Name
                                        </th>
                                        <th className="py-3 px-6 text-center">
                                            Email
                                        </th>

                                        <th className="py-3 px-6 text-center">
                                            Balance
                                        </th>
                                        <th className="py-3 px-6 text-center">
                                            Birth Date (yyyy/mm/dd)
                                        </th>
                                        <th className="py-3 px-6 text-center">
                                            telephone
                                        </th>
                                        <th className="py-3 px-6 text-center">
                                            role
                                        </th>
                                        <th className="py-3 text-center">
                                            actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 text-sm">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="py-3 px-6 text-center">
                                                {user.id}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {user.name}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {user.email}
                                            </td>

                                            <td className="py-3 px-6 text-center">
                                                {user.points_balance}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {formatDate(user.birth_date)}{" "}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {user.telephone}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {user.role}
                                            </td>
                                            <td className="py-3 text-center">
                                                {user.role === "admin" ? (
                                                    <div>X</div>
                                                ) : (
                                                    <div className="flex justify-center gap-2">
                                                        {/* Delete Icon */}
                                                        <button
                                                            onClick={() =>
                                                                clickediconDelete(
                                                                    user.id
                                                                )
                                                            }
                                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                            aria-label="Delete user"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 448 512"
                                                                className="w-5 h-5"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                                                                />
                                                            </svg>
                                                        </button>

                                                        {/* Edit Icon */}
                                                        <Link
                                                            href={`/admin/EditUser/${user.id}`}
                                                        >
                                                            {" "}
                                                            <button
                                                                className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
                                                                aria-label="Edit user"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 640 512"
                                                                    className="w-6 h-6"
                                                                >
                                                                    <path
                                                                        fill="currentColor"
                                                                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l293.1 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1l-91.4 0zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    </div>{" "}
                </>
            )}
        </AuthenticatedLayout>
    );
}
