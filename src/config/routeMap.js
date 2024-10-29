import Loadable from "react-loadable";
import Loading from "@/components/Loading";
import Pengobatan from "../views/pengobatan";
const Dashboard = Loadable({
  loader: () => import(/*webpackChunkName:'Dashboard'*/ "@/views/dashboard"),
  loading: Loading,
});
// const Berita = Loadable({
//   loader: () =>
//     import(/*webpackChunkName:'Berita'*/ "@/views/berita"),
//   loading: Loading,
// });
const Petugas = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Petugas'*/ "@/views/petugas"),
  loading: Loading,
});
const Peternak = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Peternak'*/ "@/views/peternak"),
  loading: Loading,
});
const Datakandang = Loadable({
  loader: () => import(/*webpackChunkName:'Pkb'*/ "@/views/kandang"),
  loading: Loading,
});
const Hewan = Loadable({
  loader: () => import(/*webpackChunkName:'Hewan'*/ "@/views/hewan"),
  loading: Loading,
});
const Vaksin = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Vaksin'*/ "@/views/vaksin"),
  loading: Loading,
});
const InseminasiBuatan = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Peternak'*/ "@/views/inseminasi-buatan"),
  loading: Loading,
});
const Kelahiran = Loadable({
  loader: () => import(/*webpackChunkName:'Kelahiran'*/ "@/views/kelahiran"),
  loading: Loading,
});
const pengobatan = Loadable({
  loader: () => import(/*webpackChunkName:'Pengobatan'*/ "@/views/pengobatan"),
  loading: Loading,
});
const PKB = Loadable({
  loader: () => import(/*webpackChunkName:'Pkb'*/ "@/views/pkb"),
  loading: Loading,
});

const Monitoring = Loadable({
  loader: () => import(/*webpackChunkName:'Pkb'*/ "@/views/monitoring"),
  loading: Loading,
});
const jenishewan = Loadable({
  loader: () => import(/*webpackChunkName:'Pkb'*/ "@/views/jenis-hewan"),
  loading: Loading,
});


const RichTextEditor = Loadable({
  loader: () =>
    import(
      /*webpackChunkName:'RichTextEditor'*/ "@/views/components-demo/richTextEditor"
    ),
  loading: Loading,
});
const Markdown = Loadable({
  loader: () =>
    import(/*webpackChunkName:'Markdown'*/ "@/views/components-demo/Markdown"),
  loading: Loading,
});
const Draggable = Loadable({
  loader: () =>
    import(
      /*webpackChunkName:'Draggable'*/ "@/views/components-demo/draggable"
    ),
  loading: Loading,
});


export default [
  {
    path: "/dashboard",
    component: Dashboard,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  // {
  //   path: "/berita",
  //   component: Berita,
  //   roles: ["ROLE_ADMINISTRATOR"],
  // },
  {
    path: "/petugas",
    component: Petugas,
    roles: ["ROLE_ADMINISTRATOR"],
  },
  {
    path: "/peternak",
    component: Peternak,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS"],
  },
  { 
    path: "/kandang", 
    component: Datakandang,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS",  "ROLE_PETERNAK"] 
  },
  { 
    path: "/hewan", 
    component: Hewan, 
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"] 
  },
  {
    path: "/vaksin",
    component: Vaksin,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    path: "/inseminasi-buatan",
    component: InseminasiBuatan,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  { 
    path: "/kelahiran", 
    component: Kelahiran, 
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"] 
  },
  { 
    path: "/pengobatan", 
    component: Pengobatan,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS"] 
  },
  { 
    path: "/pkb", 
    component: PKB, 
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"] 
  },
  { path: "/monitoring", 
    component: Monitoring,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"] 
  },
  { path: "/jenis-hewan", 
    component: jenishewan,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"] 
  },
];

