import React, { useState } from 'react'
import * as Yup from 'yup'

export const FromValidation = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "",
        interests: [],
        birthDate: "",
    })
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const validationSchema = Yup.object({
        firstName: Yup.string().required("First Name is Required"),
        lastName: Yup.string().required("Last Name is Required"),
        email: Yup.string()
            .required("Email is Required")
            .email("Invalid email format"),
        phoneNumber: Yup.string()
            .matches(/^\d{10}$/, "Phone Number must be 10 digits")
            .required(),
        password: Yup.string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Password must contain at least one symbol"
            )
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
        age: Yup.number()
            .typeError("Age must be a number")
            .min(18, "You must be at least 18 years old")
            .max(100, "You cannot be older than 100 years")
            .required("Age is required"),
        interests: Yup.array()
            .min(1, "Select at least one interest")
            .required("Select at least one interest"),
        birthDate: Yup.date().required("Date of birth is required"),
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Dữ liệu mẫu
        const nonParsed = {
            firstName: "Quan",
            lastName: "AP",
            email: "cobham@example.com",
            phoneNumber: "1231234218",
            password: "123456Qq*",
            confirmPassword: "123456Qq*",
            age: "18",
            gender: "male",
            interests: ["coding"],
            birthDate: "2024-02-12",
        }

        const parsedUser = validationSchema.cast(nonParsed)
        console.log(nonParsed, parsedUser)

        try {
            // Kiểm tra lỗi với formData
            await validationSchema.validate(formData, { abortEarly: false })
            console.log("Form Submitted", formData)

            // Nếu không có lỗi, xóa tất cả lỗi
            setErrors({})
        } catch (error) {
            const newErrors = {}

            // Tạo đối tượng lỗi mới
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message
            })

            // Cập nhật lỗi hiện tại
            setErrors((prevErrors) => {
                // Loại bỏ các lỗi không còn tồn tại trong newErrors
                const updatedErrors = { ...prevErrors }
                Object.keys(updatedErrors).forEach((key) => {
                    if (!newErrors[key]) {
                        delete updatedErrors[key]
                    }
                })

                // Thêm lỗi mới vào errors
                return {
                    ...updatedErrors,
                    ...newErrors,
                }
            })
        }
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target // Lấy tên và trạng thái của checkbox
        let updatedInterests = [...formData.interests] // Sao chép mảng interests hiện tại
        if (checked) {
            // Nếu checkbox được chọn, thêm tên sở thích vào mảng
            updatedInterests.push(name)
        } else {
            // Nếu checkbox không được chọn, lọc bỏ tên sở thích khỏi mảng
            updatedInterests = updatedInterests.filter(
                (interest) => interest !== name
            )
        }

        setFormData({
            // Cập nhật trạng thái formData với mảng interests mới
            ...formData,
            interests: updatedInterests,
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    return (
        <form className="w-[500px] p-4 rounded-md border-2 border-[#00bfff] mx-auto my-7 grid items-start gap-4" onSubmit={handleSubmit}>
            <div className='flex justify-center'>
                <h3 className='title'>FORM VALIDATION</h3>
            </div>
            <div className='flex items-center justify-start'>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        placeholder="Enter your first name"
                        onChange={handleChange}
                    />
                    {errors.firstName && <div className="error">{errors.firstName}</div>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Enter your last name"
                        onChange={handleChange}
                    />
                    {errors.lastName && <div className="error">{errors.lastName}</div>}
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex'>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div className='inline-block'>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        placeholder="Enter your phone number"
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && (
                        <div className="error">{errors.phoneNumber}</div>
                    )}
                </div>
                <div className='flex'>
                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        placeholder="Enter your age"
                        onChange={handleChange}
                    />
                    {errors.age && <div className="error">{errors.age}</div>}
                </div>
            </div>
            <div className='flex items-start justify-start gap-3'>
                <div>
                    <label>Password:</label>
                    <div className='flex items-start'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            placeholder="Enter your password"
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="focus:outline-none"
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-fill"></i>
                            ) : (
                                <i className="bi bi-eye-slash-fill"></i>
                            )}
                        </button>
                    </div>
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <div className='flex items-start'>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm your password"
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="focus:outline-none"
                        >
                            {showPassword ? (
                                <i className="bi bi-eye-fill"></i>
                            ) : (
                                <i className="bi bi-eye-slash-fill"></i>
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <div className="error">{errors.confirmPassword}</div>
                    )}
                </div>
            </div>
            <div>
                <label>Gender:</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender && <div className="error">{errors.gender}</div>}
            </div>

            <div>
                <label>Interests:</label>
                <label>
                    <input
                        type="checkbox"
                        name="coding"
                        checked={formData.interests.includes("coding")}
                        onChange={handleCheckboxChange}
                    />
                    Coding
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="sports"
                        checked={formData.interests.includes("sports")}
                        onChange={handleCheckboxChange}
                    />
                    Sports
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="reading"
                        checked={formData.interests.includes("reading")}
                        onChange={handleCheckboxChange}
                    />
                    Reading
                </label>
                {errors.interests && <div className="error">{errors.interests}</div>}
            </div>
            <div>
                <label>Date of Birth:</label>
                <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    placeholder="Enter your date of birth"
                    onChange={handleChange}
                />
                {errors.birthDate && <div className="error">{errors.birthDate}</div>}
            </div>
            <button className='w-full rounded bg-[#00bfff] p-2 hover:bg-[#00bfff96] text-white' type="submit">Submit</button>
        </form>
    )
}
