import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

// You can keep your AuthenticatedLayout or replace with a Bootstrap layout
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/transaction', { withCredentials: true })
            .then((response) => {
                setUser(response.data.user);
                setTransactions(response.data.transactions);
            })
            .catch((error) => {
                console.error('Error fetching transactions:', error);
                setError('Error loading data.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Custom CSS for orange theme
    const customStyles = `
        :root {
            --primary-orange: #ff7700;
            --secondary-orange: #ff9a40;
            --light-orange: #fff0e6;
        }
        
        .bg-orange {
            background-color: var(--primary-orange) !important;
        }
        
        .bg-light-orange {
            background-color: var(--light-orange) !important;
        }
        
        .text-orange {
            color: var(--primary-orange) !important;
        }
        
        .btn-orange {
            background-color: var(--primary-orange);
            border-color: var(--primary-orange);
            color: white;
        }
        
        .btn-orange:hover {
            background-color: var(--secondary-orange);
            border-color: var(--secondary-orange);
            color: white;
        }

        .transaction-points {
            font-weight: 600;
            color: var(--primary-orange);
        }
        
        .card {
            border-radius: 1rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: none;
        }
        
        .table-orange tbody tr:hover {
            background-color: var(--light-orange);
        }
    `;

    const PageHeader = (
        <div className="d-flex align-items-center">
            <i className="bi bi-receipt text-orange me-2 fs-4"></i>
            <h2 className="m-0">Transaction History</h2>
        </div>
    );

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="d-flex justify-content-center align-items-center min-vh-70">
            <div className="spinner-border text-orange" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <AuthenticatedLayout header={PageHeader}>
                <Head title="Transaction History" />
                <style>{customStyles}</style>
                <LoadingSpinner />
            </AuthenticatedLayout>
        );
    }

    if (error) {
        return (
            <AuthenticatedLayout header={PageHeader}>
                <Head title="Transaction History" />
                <style>{customStyles}</style>
                <div className="d-flex justify-content-center align-items-center min-vh-70">
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={PageHeader}>
            <Head title="Transaction History" />
            <style>{customStyles}</style>

            <div className="container py-4">
                <div className="row">
                    <div className="col-12">

                        {/* Transactions Card */}
                        <div className="card">
                            <div className="card-header bg-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-list-ul text-orange me-2"></i>
                                    Your Transactions
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    {transactions.length > 0 ? (
                                        <table className="table table-hover table-orange mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="px-4">Points</th>
                                                    <th className="px-4">Reason</th>
                                                    <th className="px-4">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((transaction, index) => (
                                                    <tr key={transaction.id_transaction_point || `txn-${index}`}>
                                                        
                                                        <td className="px-4 py-3 transaction-points">
                                                            {transaction.points_transaction > 0 ? '+' : ''}
                                                            {transaction.points_transaction}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {transaction.reason}
                                                        </td>
                                                        <td className="px-4 py-3 text-muted">
                                                            {new Date(transaction.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="bi bi-inbox text-muted fs-1"></i>
                                            <p className="mt-3 text-muted">No transactions found.</p>
                                            <button className="btn btn-orange mt-2">Make Your First Transaction</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pagination - can be connected to your backend logic */}
                        {transactions.length > 0 && (
                            <nav className="mt-4 d-flex justify-content-center">
                                <ul className="pagination">
                                    <li className="page-item disabled">
                                        <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                                    </li>
                                    <li className="page-item active">
                                        <a className="page-link bg-orange border-orange" href="#">1</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">2</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">3</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#">Next</a>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}