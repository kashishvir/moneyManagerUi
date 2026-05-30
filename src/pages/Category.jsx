import Dashboard from "../components/Dashboard.jsx";
import { useUser } from "../hooks/useUser.jsx";
import { Plus } from "lucide-react";
import CategoryList from "../components/CategoryList.jsx";
import { useEffect, useState } from "react";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Modal from "../components/Modal.jsx";
import AddCategoryForm from "../components/AddCategoryForm.jsx";

const Category = () => {
    useUser();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
    const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategoryDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
            if (response.status === 200) {
                console.log('categories', response.data);
                setCategoryData(response.data);
            }
        } catch (error) {
            console.error('Something went wrong. Please try again.', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCategoryDetails();
    }, []);

    const handleAddCategory = async (category) => {
        const { name, type, icon } = category;

        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        //check if the category already exists
        const isDuplicate = categoryData.some((category) => {
            return category.name.toLowerCase() === name.trim().toLowerCase();
        })

        if (isDuplicate) {
            toast.error("Category Name already exists");
            return;
        }

        try {
            const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, { name, type, icon });
            if (response.status === 201) {
                toast.success("Category added successfully");
                setOpenAddCategoryModal(false);
                fetchCategoryDetails();
            }
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(error.response?.data?.message || "Failed to add category.");
        }
    }

    const handleEditCategory = (categoryToEdit) => {
        setSelectedCategory(categoryToEdit);
        setOpenEditCategoryModal(true);
    }

    const handleUpdateCategory = async (updatedCategory) => {
        const { id, name, type, icon } = updatedCategory;
        if (!name.trim()) {
            toast.error("Category Name is required");
            return;
        }

        if (!id) {
            toast.error("Category ID is missing for update");
            return;
        }

        // Check if the category name already exists under a different ID
        const isDuplicate = categoryData.some((cat) => {
            return cat.id !== id && cat.name.toLowerCase() === name.trim().toLowerCase();
        });

        if (isDuplicate) {
            toast.error("Category Name already exists");
            return;
        }

        try {
            await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id), { name, type, icon });
            setOpenEditCategoryModal(false);
            setSelectedCategory(null);
            toast.success("Category updated successfully");
            fetchCategoryDetails();
        } catch (error) {
            console.error('Error updating category:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update category.");
        }
    }

    return (
        <Dashboard activeMenu="Category">
            <div className="my-6 max-w-[1400px] mx-auto space-y-6">
                {/* Header Container */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/5 p-5 rounded-2xl shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Financial Categories</h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Create and customize categories to organize income sources and expenses.</p>
                    </div>
                    <button
                        onClick={() => setOpenAddCategoryModal(true)}
                        className="add-btn self-start sm:self-auto cursor-pointer"
                    >
                        <Plus size={16} />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Category list */}
                <CategoryList categories={categoryData} onEditCategory={handleEditCategory} />

                {/* Adding category modal*/}
                <Modal
                    isOpen={openAddCategoryModal}
                    onClose={() => setOpenAddCategoryModal(false)}
                    title="Add Category"
                >
                    <AddCategoryForm onAddCategory={handleAddCategory} />
                </Modal>

                {/* Updating category modal*/}
                <Modal
                    onClose={() => {
                        setOpenEditCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    isOpen={openEditCategoryModal}
                    title="Update Category"
                >
                    <AddCategoryForm
                        initialCategoryData={selectedCategory}
                        onAddCategory={handleUpdateCategory}
                        isEditing={true}
                    />
                </Modal>
            </div>
        </Dashboard>
    )
}

export default Category;