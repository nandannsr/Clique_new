import React from 'react'
import { useFormik } from 'formik'
import { basicSchema } from '../../schemas/regSchema'
import instance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom'



const Register = () => {
    const navigate = useNavigate()
    const onSubmit = async (values, actions) => {
    
        try {
          const response = await instance.post('/api/register/', {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            password: values.password,
            password2: values.confirmPassword,
            phone_number: values.phoneNumber,
    
          })
          if (response.status === 201){
            console.log(response.status)
            navigate("/login", { state: { message: "Registration Successful" } })
          }
          else{
            console.log(response.status)
            alert("not valid")
          }
          
        }
        catch (error) {
          alert(error);
          console.log(error);
        }
        actions.resetForm();
        
    }; 
    
    const formik = useFormik({
        initialValues :{
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        },
        validationSchema: basicSchema,
        onSubmit,
      });
      console.log(formik.errors)

    return (
    <div className="bg-slate-800 min-h-screen">
      <header className="flex items-center justify-between p-4">
        <div className="text-white font-medium text-xl">CliQue</div>
        <button className="bg-pink-600 text-white py-1 px-2 rounded-full" onClick={() => navigate("/login")}>
          Login in here
        </button>
      </header>
      <div className="mx-auto w-full md:w-3/4 max-w-xl p-4 md:p-20 bg-slate-900" style={{ minHeight: '50vh', marginTop: '10vh', borderRadius: '90px' }}>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4 text-center">
            <div className="flex flex-col md:flex-row mb-4 mt-10">
              <div className="w-full md:w-1/2 mr-0 md:mr-2 mb-4 md:mb-0">
                <input
                  type="text" value={formik.values.firstName}
                  onChange={formik.handleChange}
                  id="firstName"
                  placeholder="First Name"
                  className="block w-full border rounded-full p-2 "
                  onBlur={formik.handleBlur}
                />
                {formik.errors.firstName && formik.touched.firstName && <p className="text-sm text-pink-600">{ formik.errors.firstName }</p>}
              </div>
              <div className="w-full md:w-1/2 mr-0 md:mr-2 mb-4 md:mb-0">
                <input
                  type="text" value={formik.values.lastName}
                  onChange={formik.handleChange}
                  id="lastName"
                  placeholder="Last Name"
                  className="block w-full border rounded-full p-2"
                  onBlur={formik.handleBlur}
                />
                {formik.errors.lastName && formik.touched.lastName && <p className="text-sm text-pink-600">{ formik.errors.lastName }</p>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mb-4">
              <div className="w-full md:w-1/2 mr-0 md:mr-2 mb-4 md:mb-0">
                <input
                  type="email" value={formik.values.email}
                  onChange={formik.handleChange}
                  id="email"
                  placeholder="Email"
                  className="block w-full border rounded-full p-2"
                  onBlur={formik.handleBlur}
                />
                {formik.errors.email && formik.touched.email && <p className="text-sm text-pink-600">{ formik.errors.email }</p>}
              </div>
              <div className="w-full md:w-1/2 mr-0 md:mr-2 mb-4 md:mb-0">
                <input
                  type="tel" value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  id="phoneNumber"
                  placeholder="Phone Number"
                  className="block w-full border rounded-full p-2"
                  onBlur={formik.handleBlur}
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && <p className="text-sm text-pink-600">{ formik.errors.phoneNumber }</p>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row mb-10">
              <div className="w-full md:w-1/2 mr-0 md:mr-2 mb-4 md:mb-0">
                <input
                  type="password" value={formik.values.password}
                  onChange={formik.handleChange}
                  id="password"
                  placeholder="Password"
                  className="block w-full border rounded-full p-2"
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && <p className="text-sm text-pink-600">{ formik.errors.password }</p>}
              </div>
              <div className="w-full md:w-1/2 mr-0 md:mr-2 mb-4 md:mb-0">
                <input
                  type="password" value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="block w-full border rounded-full p-2"
                  onBlur={formik.handleBlur}
                />
                {formik.errors.confirmPassword && formik.touched.confirmPassword && <p className="text-sm text-pink-600">{ formik.errors.confirmPassword }</p>}
              </div>
            </div>
            <button type='submit' className="bg-pink-600 text-white w-1/3 py-1 px-2 rounded-full hover:bg-pink-700 mx-auto">
              Register
            </button>
            <div className="text-center mt-4">
            <span className='text-white'>Already registered,  </span><a href="#" className="text-pink-600" onClick={() => navigate("/login")}>Sign In</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register