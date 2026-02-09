import CreateProductForm from "../components/AdminDashboard/CreateProductForm/CreateProductForm";
import { FiPlus } from "react-icons/fi";

const CreateProduct = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <FiPlus className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Add a new product to your inventory</p>
        </div>

        {/* Form */}
        <CreateProductForm />
      </div>
    </div>
  );
};

export default CreateProduct;

