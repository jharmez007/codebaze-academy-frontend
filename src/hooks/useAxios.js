// "use client";

// import { useEffect } from "react";
// import Api from "./"
// import { axiosInstance } from "@/lib/axiosInstance";

// const useAxiosPrivate = () => {
 

//   useEffect(() => {
//     const requestIntercept = axiosInstance.interceptors.request.use(
//       async (config) => {
//     const token = localStorage.getItem("token");
//     if (token && !config.headers["Authorization"]) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
//     );

//     const responseIntercept = axiosInstance.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const prevRequest = error?.config;
        
//             if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
//               throw new Error("Request timed out");
//             }
        
//             if (
//               error?.response?.status === 401 &&
//               error?.response?.data?.msg?.includes("Token has expired") &&
//               !prevRequest?._retry
//             ) {
//               prevRequest._retry = true;
//               try {
//                 const newAccessToken = await refreshToken();
//                 console.log("newaccess_token:", newAccessToken)
//                 return Api({
//                   ...prevRequest,
//                   headers: {
//                     ...prevRequest.headers,
//                     Authorization: `Bearer ${newAccessToken}`,
//                   },
//                 });
//               } catch (refreshError) {
//                 return Promise.reject(refreshError);
//               }
//             }

//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axiosInstance.interceptors.request.eject(requestIntercept);
//       axiosInstance.interceptors.response.eject(responseIntercept);
//     };
//   }, []);

//   return axiosInstance;
// };

// export default useAxiosPrivate;