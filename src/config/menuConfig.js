const menuList = [
  {
    title: "Beranda",
    path: "/dashboard",
    icon: "home",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  // {
  //   title: "Berita",
  //   path: "/berita",
  //   icon: "book",
  //   roles:["ROLE_ADMINISTRATOR"]
  // },
  {
    title: "Data Petugas",
    path: "/petugas",
    icon: "user",
    roles: ["ROLE_ADMINISTRATOR",],
  },
  {
    title: "Data Peternak",
    path: "/peternak",
    icon: "user",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS"],
  },
  {
    title: "Data Kandang",
    path: "/kandang",
    icon: "home",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Daftar Hewan",
    path: "/hewan",
    icon: "apartment",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Daftar Vaksin",
    path: "/vaksin",
    icon: "project",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Inseminasi Buatan",
    path: "/inseminasi-buatan",
    icon: "table",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Kelahiran",
    path: "/kelahiran",
    icon: "file-search",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Pengobatan",
    path: "/pengobatan",
    icon: "experiment",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS"],
  },
  {
    title: "PKB",
    path: "/pkb",
    icon: "copy",
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
//   {title: "Monitoring",
//   path: "/monitoring",
//   icon: "camera",
//   roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
// }
];
export default menuList;
