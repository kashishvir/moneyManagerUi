import { useState, useEffect } from "react";
import EmojiPickerPopup from "./EmojiPickerPopup.jsx";
import Input from "./Input.jsx";
import { LoaderCircle } from "lucide-react";

const AddExpenseForm = ({ onAddExpense, categories }) => {
    const [expense, setExpense] = useState({
        name: "",
        categoryId: "",
        amount: "",
        date: "",
        icon: "",
    });
    const [loading, setLoading] = useState(false);

    // Effect to set a default category if categories are loaded and none is selected
    useEffect(() => {
        if (categories && categories.length > 0 && !expense.categoryId) {
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
        }
    }, [categories, expense.categoryId]);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value });

    // Map categories to the format expected by the reusable Input dropdown
    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: `${cat.name}`,
    }));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={({ target }) => handleChange("name", target.value)}
                label="Expense Source / Description"
                placeholder="e.g., Electricity, Wifi, Groceries"
                type="text"
            />

            <Input
                label="Category"
                value={expense.categoryId}
                onChange={({ target }) => handleChange("categoryId", target.value)}
                isSelect={true}
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="e.g., 150.00"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    disabled={loading}
                    className="add-btn add-btn-fill"
                    onClick={handleSubmit}
                >
                    {loading ? (
                        <>
                            <LoaderCircle className="w-4 h-4 animate-spin"/>
                            Adding...
                        </>
                    ) : (
                        "Add Expense"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;