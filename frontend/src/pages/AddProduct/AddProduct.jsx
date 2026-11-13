import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";
import { api } from "../../utils/api";

export default function AddProduct() {

    const navigate = useNavigate();

    const [form, setForm] = useState({

        farmer_id: 1,

        product_name: "",

        category: "",

        quantity: "",

        unit: "Kg",

        harvest_date: "",

        storage_type: "",

        temperature: "",

        humidity: "",

        image: ""

    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState("");

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const saveProduct = async () => {

        setLoading(true);

        setMessage("");

        try {

            const payload = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                payload.append(key, value);
            });

            if (image) {
                payload.append("image", image);
            }

            const data = await api.post("/products", payload);

            setMessage(data.message || "Product added successfully");

            setTimeout(() => {

                navigate("/my-products");

            }, 1500);

        }

        catch (err) {

            setMessage(err.message);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className={styles.container}>

            <div className={styles.card}>

                <h1>Add Product</h1>

                <input

                    name="product_name"

                    placeholder="Product Name"

                    onChange={handleChange}

                />

                <select

                    name="category"

                    onChange={handleChange}

                >

                    <option value="">Category</option>

                    <option>Vegetable</option>

                    <option>Fruit</option>

                    <option>Grains</option>

                    <option>Dairy</option>

                </select>

                <input

                    name="quantity"

                    type="number"

                    placeholder="Quantity"

                    onChange={handleChange}

                />

                <select

                    name="unit"

                    onChange={handleChange}

                >

                    <option>Kg</option>

                    <option>Ton</option>

                    <option>Piece</option>

                    <option>Litre</option>

                </select>

                <input

                    type="date"

                    name="harvest_date"

                    onChange={handleChange}

                />

                <select

                    name="storage_type"

                    onChange={handleChange}

                >

                    <option value="">Storage Type</option>

                    <option>Room</option>

                    <option>Cold Storage</option>

                </select>

                <input

                    type="number"

                    name="temperature"

                    placeholder="Temperature"

                    onChange={handleChange}

                />

                <input

                    type="number"

                    name="humidity"

                    placeholder="Humidity"

                    onChange={handleChange}

                />

                <div className={styles.inputGroup}>

                    <label>Product Image</label>

                    <input

                        type="file"

                        accept="image/*"

                        onChange={(e) => {

                            const file = e.target.files[0];

                            if (!file) return;

                            setImage(file);

                            setPreview(URL.createObjectURL(file));

                        }}

                    />

                </div>

                {
                    preview && (

                        <img

                            src={preview}

                            alt="Preview"

                            className={styles.previewImage}

                        />

                    )
                }

                <button

                    onClick={saveProduct}

                >

                    {

                        loading

                            ?

                            "Saving..."

                            :

                            "Save Product"

                    }

                </button>

                {

                    message &&

                    <p>{message}</p>

                }

            </div>

        </div>

    );

}
