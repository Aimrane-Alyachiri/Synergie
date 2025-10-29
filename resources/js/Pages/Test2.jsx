import axios from "axios";
import AuthenticatedLayout from '@/Layouts/AuthificatedLayoutAdmin';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from "react";

export default function Test() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetshDate = async () => {
            const response = await axios.get("/api/getUsers");
            setUsers(response.data);
            setLoading(false);
        };
        fetshDate();
    }, []);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users Data
                </h2>
            }
        >
            <Head title="Users" />
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Users</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <table className="min-w-full bg-white border border-gray-200 shadow rounded-xl">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>{" "}
        </AuthenticatedLayout>
    );
}
