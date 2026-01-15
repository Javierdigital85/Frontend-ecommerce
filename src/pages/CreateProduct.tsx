// importar el componenete formulario

import CreateProductForm from "../components/AdminDashboard/CreateProductForm/CreateProductForm";

const CreateProduct = () => {
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center my-10">Crear producto</h1>
      <CreateProductForm/>
    </div>
  );
};

export default CreateProduct