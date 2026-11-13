import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/api";
import styles from "./EditProduct.module.css";

export default function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [form, setForm] = useState({

        product_name: "",

        category: "",

        quantity: "",

        unit: "",

        harvest_date: "",

        storage_type: "",

        temperature: "",

        humidity: ""

    });

    useEffect(() => {

        loadProduct();

    }, []);

    async function loadProduct() {

        try {

            const res = await api.get(`/products/${id}`);

            const product = res.product || res;
            setForm({
                product_name: product.product_name || "",
                category: product.category || "",
                quantity: product.quantity || "",
                unit: product.unit || "",
                harvest_date: product.harvest_date || "",
                storage_type: product.storage_type || "",
                temperature: product.temperature || "",
                humidity: product.humidity || ""
            });

        }

        catch (err) {

            alert(err.message);

        }

    }

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await api.put(`/products/${id}`, form);

            alert("Product Updated Successfully");

            navigate("/my-products");

        }

        catch (err) {

            alert(err.message);

        }

    }

    return (

        <div className={styles.container}>

            <h1>Edit Product</h1>

            <form
                onSubmit={handleSubmit}
                className={styles.form}
            >

                <input
                    name="product_name"
                    value={form.product_name}
                    onChange={handleChange}
                    placeholder="Product Name"
                />

                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Category"
                />

                <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
                />

                <input
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="Unit"
                />

                <input
                    type="date"
                    name="harvest_date"
                    value={form.harvest_date}
                    onChange={handleChange}
                />

                <input
                    name="storage_type"
                    value={form.storage_type}
                    onChange={handleChange}
                    placeholder="Storage Type"
                />

                <input
                    name="temperature"
                    value={form.temperature}
                    onChange={handleChange}
                    placeholder="Temperature"
                />

                <input
                    name="humidity"
                    value={form.humidity}
                    onChange={handleChange}
                    placeholder="Humidity"
                />

                <button type="submit">

                    Update Product

                </button>

            </form>

        </div>

    );

}
