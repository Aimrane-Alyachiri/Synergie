import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <nav className="border-b border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Logo + Nav */}
                        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
                            <Link href="/dashboard" className="flex items-center space-x-1 sm:space-x-2 group transition duration-300">
                                <div className="rounded-full p-1 dark:bg-gray-700">
                                    <img
                                        src="storage/logo.png" 
                                        alt="Loyalty Logo"
                                        className="h-10 sm:h-12 md:h-16 w-auto transition-all duration-300 group-hover:opacity-80"
                                    />                               
                                </div>
                                <span className="font-bold text-sm sm:text-base md:text-lg text-orange-600 group-hover:text-orange-500 hidden sm:inline transition-colors">
                                    Loyalty+
                                </span>
                            </Link>

                            <div className="hidden md:flex space-x-4 lg:space-x-8">
                                <NavLink href={route("dashboard")} active={route().current("dashboard")} className="font-medium transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1">
                                    Dashboard
                                </NavLink>
                                
                                <NavLink href="/rewards" active={route().current("rewards.index")} className="font-medium transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1">
                                    Rewards
                                </NavLink>
                                
                                <NavLink href="/claimed-rewards" active={route().current("rewards.claimed")} className="font-medium transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1">
                                    My Claims
                                </NavLink>
                                
                                <NavLink href="/transaction" active={route().current("transaction.index")} className="font-medium transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 hidden lg:inline-block">
                                    View Transaction History
                                </NavLink>
                                
                                <NavLink href="/transaction" active={route().current("transaction.index")} className="font-medium transition-all duration-200 border-b-2 border-transparent hover:border-orange-500 pb-1 lg:hidden">
                                    Transactions
                                </NavLink>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="hidden md:flex md:items-center space-x-2 lg:space-x-6">

                            {/* Your Points Balance */}
                            <div className="flex items-center bg-orange-100 dark:bg-gray-700 rounded-lg px-2 sm:px-3 py-1 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                                <div className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400">
                                    {user.points_balance} pts
                                </div>
                            </div>

                            {/* User Name */}
                            <div className="hidden lg:flex items-center rounded-full bg-orange-50 px-4 py-1 dark:bg-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user.name}
                                </span>
                            </div>

                            {/* Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button type="button" className="inline-flex items-center px-2 sm:px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200">
                                            <img src={user.user_image_path || "https://ui-avatars.com/api/?name=User&background=fb923c&color=ffffff"} className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover mr-1 sm:mr-2 border-2 border-orange-100 dark:border-gray-600 shadow-sm" alt="User Avatar" />
                                            <span className="hidden sm:inline">Menu</span>
                                            <svg className="ml-1 sm:ml-2 h-4 w-4 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link method="post" href={route("logout")} as="button">
                                        Log out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="flex items-center md:hidden">
                            {/* Mobile Points Display */}
                            <div className="flex items-center bg-orange-100 dark:bg-gray-700 rounded-lg px-2 py-1 shadow-sm mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                    {user.points_balance}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                                className="p-2 text-gray-500 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    {showingNavigationDropdown ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <div className={`${showingNavigationDropdown ? "block" : "hidden"} md:hidden`}>
                    <div className="pt-2 pb-3 space-y-1 px-2 sm:px-4">

                        {/* Mobile Links */}
                        <ResponsiveNavLink href={route("dashboard")} active={route().current("dashboard")}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="/rewards" active={route().current("rewards.index")}>
                            Rewards
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="/claimed-rewards" active={route().current("rewards.claimed")}>
                            My Claims
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="/transaction" active={route().current("transaction.index")}>
                            Transaction History
                        </ResponsiveNavLink>
                    </div>

                    {/* Mobile User Info */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-1 px-4">
                        <div className="flex items-center space-x-4">
                            <img src={user.user_image_path || "https://ui-avatars.com/api/?name=User&background=fb923c&color=ffffff"} className="h-10 w-10 rounded-full object-cover border-2 border-orange-100 dark:border-gray-600" alt="User Avatar" />
                            <div className="flex-1">
                                <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="font-medium text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                    {user.email}
                                </div>
                            </div>
                            {/* Mobile Profile Actions */}
                            <div className="flex space-x-2">
                                <Link
                                    href={route("profile.edit")}
                                    className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-orange-100 text-orange-600 dark:bg-gray-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-gray-600 transition"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Slot */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="py-4 sm:py-6">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}