const departmentApi = (baseUrl) => {
  const controller = "/Departments";
  return {
    index: baseUrl + controller,
  };
};

export default departmentApi;
