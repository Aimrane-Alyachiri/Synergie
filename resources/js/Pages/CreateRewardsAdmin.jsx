import { useState, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthificatedLayoutAdmin";
import { Head } from "@inertiajs/react";

import {
    Calendar,
    CheckCircle,
    Gift,
    Upload,
    Save,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";

export default function CreateRewardForm() {
    const [formData, setFormData] = useState({
        title_reward: "",
        description_reward: "",
        points_cost: "",
        stock_quantity: "",
        is_active: true,
        expiration_date: "",
        image_reward_path: null,
    });

    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({
        type: "",
        message: "",
    });
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "file") {
            handleFileSelect(e.target.files[0]);
        } else if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        setFormData({ ...formData, image_reward_path: file });

        // Create image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title_reward.trim())
            newErrors.title_reward = "Title is required";

        if (!formData.description_reward.trim())
            newErrors.description_reward = "Description is required";

        if (!formData.points_cost || formData.points_cost <= 0)
            newErrors.points_cost = "Points cost must be greater than 0";

        if (formData.stock_quantity === "" || formData.stock_quantity < 0)
            newErrors.stock_quantity = "Stock quantity must be 0 or greater";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);
        setSubmitMessage({ type: "", message: "" });

        try {
            const submitData = new FormData();
            for (const key in formData) {
                if (key === "image_reward_path" && formData[key]) {
                    submitData.append(key, formData[key]);
                } else if (key === "is_active") {
                    submitData.append(key, formData[key] ? "1" : "0");
                } else {
                    submitData.append(key, formData[key]);
                }
            }

            const response = await axios.post(
                "/admin/Createrewards", // Make sure your API endpoint is correct!
                submitData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setSubmitMessage({
                type: "success",
                message:
                    response.data.message || "Reward created successfully!",
            });

            setFormData({
                title_reward: "",
                description_reward: "",
                points_cost: "",
                stock_quantity: "",
                is_active: true,
                expiration_date: "",
                image_reward_path: null,
            });
            setPreview(null);
            setErrors({});
        } catch (error) {
            console.error("Error creating reward:", error);

            if (error.response) {
                if (error.response.status === 422) {
                    const serverErrors = {};
                    const errorsData = error.response.data.errors || {};
                    Object.keys(errorsData).forEach((key) => {
                        serverErrors[key] = errorsData[key][0];
                    });
                    setErrors(serverErrors);

                    setSubmitMessage({
                        type: "error",
                        message: "Validation failed, please check your form",
                    });
                } else {
                    setSubmitMessage({
                        type: "error",
                        message:
                            error.response.data.message ||
                            "An error occurred during submission",
                    });
                }
            } else {
                setSubmitMessage({
                    type: "error",
                    message: "Network error or server did not respond",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Rewards{" "}
                </h2>
            }
        >
            <Head title="Users" />
            <div className="max-w-7xl mx-auto bg-gray-50 p-6 rounded-xl shadow-lg mt-5">
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="bg-orange-600 text-white p-6">
                        <div className="flex items-center">
                            <Gift className="mr-3" size={28} />
                            <h2 className="text-2xl font-bold">
                                Create New Reward
                            </h2>
                        </div>
                        <p className="mt-2 opacity-80 text-sm">
                            Add a new reward to your loyalty program
                        </p>
                    </div>

                    <div className="p-8">
                        {submitMessage.message && (
                            <div
                                className={`mb-8 p-4 rounded-lg flex items-start ${
                                    submitMessage.type === "error"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-green-50 text-green-700"
                                }`}
                            >
                                {submitMessage.type === "error" ? (
                                    <AlertCircle
                                        className="mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                ) : (
                                    <CheckCircle
                                        className="mr-3 flex-shrink-0"
                                        size={20}
                                    />
                                )}
                                <span className="text-sm">
                                    {submitMessage.message}
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label
                                            htmlFor="title_reward"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Reward Title{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            id="title_reward"
                                            name="title_reward"
                                            value={formData.title_reward}
                                            onChange={handleChange}
                                            placeholder="Enter reward title"
                                            className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                                errors.title_reward
                                                    ? "border-2 border-red-300 bg-red-50 focus:ring-red-200"
                                                    : "border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            } focus:ring-opacity-50 focus:outline-none`}
                                        />
                                        {errors.title_reward && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.title_reward}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="points_cost"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Points Cost{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            id="points_cost"
                                            name="points_cost"
                                            value={formData.points_cost}
                                            onChange={handleChange}
                                            min="1"
                                            placeholder="100"
                                            className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                                errors.points_cost
                                                    ? "border-2 border-red-300 bg-red-50 focus:ring-red-200"
                                                    : "border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            } focus:ring-opacity-50 focus:outline-none`}
                                        />
                                        {errors.points_cost && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.points_cost}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="description_reward"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Description{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description_reward"
                                        name="description_reward"
                                        value={formData.description_reward}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Describe what this reward offers to customers"
                                        className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                            errors.description_reward
                                                ? "border-2 border-red-300 bg-red-50 focus:ring-red-200"
                                                : "border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        } focus:ring-opacity-50 focus:outline-none`}
                                    ></textarea>
                                    {errors.description_reward && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.description_reward}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label
                                            htmlFor="stock_quantity"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Stock Quantity{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            id="stock_quantity"
                                            name="stock_quantity"
                                            value={formData.stock_quantity}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="10"
                                            className={`w-full px-4 py-3 rounded-lg transition-colors ${
                                                errors.stock_quantity
                                                    ? "border-2 border-red-300 bg-red-50 focus:ring-red-200"
                                                    : "border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            } focus:ring-opacity-50 focus:outline-none`}
                                        />
                                        {errors.stock_quantity && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.stock_quantity}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="expiration_date"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Expiration Date
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Calendar
                                                    size={18}
                                                    className="text-gray-500"
                                                />
                                            </div>
                                            <input
                                                type="date"
                                                id="expiration_date"
                                                name="expiration_date"
                                                value={formData.expiration_date}
                                                onChange={handleChange}
                                                className="w-full pl-12 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reward Image
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                                            isDragging
                                                ? "border-blue-400 bg-blue-50"
                                                : "border-gray-300 hover:border-gray-400"
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            id="image_reward_path"
                                            name="image_reward_path"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
                                            <div className="p-3 bg-gray-100 rounded-full">
                                                <Upload
                                                    size={24}
                                                    className="text-gray-500"
                                                />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-700">
                                                    {preview
                                                        ? "Change image"
                                                        : "Upload an image"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Drag & drop or click to
                                                    browse
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {preview && (
                                        <div className="mt-4">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-2">
                                                    Preview:
                                                </p>
                                                <div className="flex justify-center bg-white p-4 rounded border border-gray-200">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="h-40 w-auto object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {errors.image_reward_path && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.image_reward_path}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor="is_active"
                                            className="ml-3 block text-sm font-medium text-gray-700"
                                        >
                                            Active Reward
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 ml-8">
                                        Only active rewards will be visible to
                                        users in the rewards catalog
                                    </p>
                                    {errors.is_active && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {errors.is_active}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
                             

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                        isSubmitting
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    } transition-colors`}
                                >
                                    <Save size={18} className="mr-2" />
                                    {isSubmitting
                                        ? "Creating..."
                                        : "Create Reward"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
