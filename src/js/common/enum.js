const $enum = {
  form: {
    infoType: "info",
    createType: "create",
  },
  api: {
    departments: "https://cukcuk.manhnv.net/api/v1/Departments",
    employees: {
      index: "https://cukcuk.manhnv.net/api/v1/Employees",
      newCode: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
      one: (id) => `https://cukcuk.manhnv.net/api/v1/Employees/${id}`,
    },
  },
  gender: {
    male: 0,
    female: 1,
    other: 2,
  },
  notibox: {
    alertType: "alert",
  },
};

export default $enum;
