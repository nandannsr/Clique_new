import instance from "./axiosInstance";

const fetchGenres = async () => {
    try {
      const response = await instance.get('/api/genres');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export default fetchGenres;