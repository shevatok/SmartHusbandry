/*! For license information please see Berita.1be42afd.chunk.js.LICENSE.txt */
(this.webpackJsonpreact_antd_admin_template=this.webpackJsonpreact_antd_admin_template||[]).push([[0],{1335:function(e,t,a){"use strict";a.r(t);a(219);var r=a(131),n=(a(128),a(33)),i=(a(222),a(103)),o=(a(178),a(53)),l=(a(179),a(31)),c=(a(101),a(30)),u=(a(296),a(133)),s=(a(132),a(35)),d=(a(129),a(69)),p=a(70),h=a(28),f=a(29),m=a(51),g=a(50),v=a(0),b=a.n(v),y=a(34);function E(e){var t=new FormData;return t.append("judul",e.judul),t.append("tglPembuatan",e.tglPembuatan),t.append("isiBerita",e.isiBerita),t.append("pembuat",e.pembuat),t.append("file",e.file.file),Object(y.a)({url:"/berita",method:"post",data:t})}function B(){return Object(y.a)({url:"/berita",method:"get"})}function w(e,t){var a=new FormData;return a.append("judul",e.judul),a.append("tglPembuatan",e.tglPembuatan),a.append("isiBerita",e.isiBerita),a.append("pembuat",e.pembuat),a.append("file",e.file.file),Object(y.a)({url:"/berita/".concat(t),method:"put",data:a})}function k(e){return Object(y.a)({url:"/berita/".concat(e.idBerita),method:"delete",data:e})}var O=a(220),L=(a(295),a(221)),x=(a(89),a(5)),j=(a(176),a(19)),C=function(e){Object(m.a)(a,e);var t=Object(g.a)(a);function a(){return Object(h.a)(this,a),t.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){var e=this.props,t=e.visible,a=e.onCancel,r=e.onOk,i=e.form,o=e.confirmLoading,l=e.currentRowData,c=i.getFieldDecorator,u=(l.idBerita,l.judul),s=l.tglPembuatan,p=l.isiBerita,h=l.pembuat;return b.a.createElement(d.a,{title:"Edit Data Berita",visible:t,onCancel:a,onOk:r,confirmLoading:o,width:700},b.a.createElement(j.a,{form:{labelCol:{xs:{span:20},sm:{span:6}},wrapperCol:{xs:{span:19},sm:{span:17}}},name:"validateOnly",layout:"vertical",autoComplete:"off"},b.a.createElement(j.a.Item,{label:"Judul Berita"},c("judul",{initialValue:u})(b.a.createElement(n.a,{placeholder:"Masukkan Judul Berita!"}))),b.a.createElement(j.a.Item,{label:"Tanggal Pembuatan"},c("tglPembuatan",{initialValue:s})(b.a.createElement(n.a,{placeholder:"Masukkan No Telepon Berita!"}))),b.a.createElement(j.a.Item,{label:"Isi Berita"},c("isiBerita",{initialValue:p})(b.a.createElement(n.a,{placeholder:"Masukkan Email Berita!"}))),b.a.createElement(j.a.Item,{label:"Creator"},c("pembuat",{initialValue:h})(b.a.createElement(n.a,{placeholder:"Masukkan Creator!"}))),b.a.createElement(j.a.Item,{label:"Foto Berita",name:"file"},c("file")(b.a.createElement(L.a.Dragger,{beforeUpload:function(){return!1},listType:"picture"},b.a.createElement("p",{className:"ant-upload-drag-icon"},b.a.createElement(x.a,{type:"inbox"})),b.a.createElement("p",{className:"ant-upload-text"},"Click or drag file to this area to upload"),b.a.createElement("p",{className:"ant-upload-hint"},"Support for a single or bulk upload."))))))}}]),a}(v.Component),M=j.a.create({name:"EditBeritaForm"})(C),S=function(e){Object(m.a)(a,e);var t=Object(g.a)(a);function a(){return Object(h.a)(this,a),t.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){var e=this.props,t=e.visible,a=e.onCancel,r=e.onOk,i=e.form,o=e.confirmLoading,l=i.getFieldDecorator;return b.a.createElement(d.a,{title:"Tambah Data Berita",visible:t,onCancel:a,onOk:r,confirmLoading:o,width:700},b.a.createElement(j.a,{form:{labelCol:{xs:{span:20},sm:{span:6}},wrapperCol:{xs:{span:19},sm:{span:17}}},onSubmit:this.handleSubmit},b.a.createElement(j.a.Item,{label:"Judul Berita:"},l("judul",{rules:[{required:!0,message:"Masukkan nik petugas!"}]})(b.a.createElement(n.a,{placeholder:"Masukkan nik petugas"}))),b.a.createElement(j.a.Item,{label:"Tanggal Pembuatan:"},l("tglPembuatan",{})(b.a.createElement(n.a,{type:"date",placeholder:"Masukkan Tanggal Pembuatan"}))),b.a.createElement(j.a.Item,{label:"Isi Berita:"},l("isiBerita",{})(b.a.createElement(n.a,{placeholder:"Masukkan Isi Berita"}))),b.a.createElement(j.a.Item,{label:"Creator:"},l("pembuat",{})(b.a.createElement(n.a,{placeholder:"Masukkan Email Berita"}))),b.a.createElement(j.a.Item,{label:"Foto Berita",name:"file"},l("file")(b.a.createElement(L.a.Dragger,{beforeUpload:function(){return!1},listType:"picture"},b.a.createElement("p",{className:"ant-upload-drag-icon"},b.a.createElement(x.a,{type:"inbox"})),b.a.createElement("p",{className:"ant-upload-text"},"Click or drag file to this area to upload"),b.a.createElement("p",{className:"ant-upload-hint"},"Support for a single or bulk upload."))))))}}]),a}(v.Component),I=j.a.create({name:"AddBeritaForm"})(S),T=a(102),_=a(694);function F(){F=function(){return e};var e={},t=Object.prototype,a=t.hasOwnProperty,r=Object.defineProperty||function(e,t,a){e[t]=a.value},n="function"==typeof Symbol?Symbol:{},i=n.iterator||"@@iterator",o=n.asyncIterator||"@@asyncIterator",l=n.toStringTag||"@@toStringTag";function c(e,t,a){return Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{c({},"")}catch(C){c=function(e,t,a){return e[t]=a}}function u(e,t,a,n){var i=t&&t.prototype instanceof p?t:p,o=Object.create(i.prototype),l=new L(n||[]);return r(o,"_invoke",{value:B(e,a,l)}),o}function s(e,t,a){try{return{type:"normal",arg:e.call(t,a)}}catch(C){return{type:"throw",arg:C}}}e.wrap=u;var d={};function p(){}function h(){}function f(){}var m={};c(m,i,(function(){return this}));var g=Object.getPrototypeOf,v=g&&g(g(x([])));v&&v!==t&&a.call(v,i)&&(m=v);var b=f.prototype=p.prototype=Object.create(m);function y(e){["next","throw","return"].forEach((function(t){c(e,t,(function(e){return this._invoke(t,e)}))}))}function E(e,t){var n;r(this,"_invoke",{value:function(r,i){function o(){return new t((function(n,o){!function r(n,i,o,l){var c=s(e[n],e,i);if("throw"!==c.type){var u=c.arg,d=u.value;return d&&"object"==typeof d&&a.call(d,"__await")?t.resolve(d.__await).then((function(e){r("next",e,o,l)}),(function(e){r("throw",e,o,l)})):t.resolve(d).then((function(e){u.value=e,o(u)}),(function(e){return r("throw",e,o,l)}))}l(c.arg)}(r,i,n,o)}))}return n=n?n.then(o,o):o()}})}function B(e,t,a){var r="suspendedStart";return function(n,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===n)throw i;return j()}for(a.method=n,a.arg=i;;){var o=a.delegate;if(o){var l=w(o,a);if(l){if(l===d)continue;return l}}if("next"===a.method)a.sent=a._sent=a.arg;else if("throw"===a.method){if("suspendedStart"===r)throw r="completed",a.arg;a.dispatchException(a.arg)}else"return"===a.method&&a.abrupt("return",a.arg);r="executing";var c=s(e,t,a);if("normal"===c.type){if(r=a.done?"completed":"suspendedYield",c.arg===d)continue;return{value:c.arg,done:a.done}}"throw"===c.type&&(r="completed",a.method="throw",a.arg=c.arg)}}}function w(e,t){var a=t.method,r=e.iterator[a];if(void 0===r)return t.delegate=null,"throw"===a&&e.iterator.return&&(t.method="return",t.arg=void 0,w(e,t),"throw"===t.method)||"return"!==a&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+a+"' method")),d;var n=s(r,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,d;var i=n.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,d):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,d)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function L(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function x(e){if(e){var t=e[i];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,n=function t(){for(;++r<e.length;)if(a.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=void 0,t.done=!0,t};return n.next=n}}return{next:j}}function j(){return{value:void 0,done:!0}}return h.prototype=f,r(b,"constructor",{value:f,configurable:!0}),r(f,"constructor",{value:h,configurable:!0}),h.displayName=c(f,l,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===h||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,f):(e.__proto__=f,c(e,l,"GeneratorFunction")),e.prototype=Object.create(b),e},e.awrap=function(e){return{__await:e}},y(E.prototype),c(E.prototype,o,(function(){return this})),e.AsyncIterator=E,e.async=function(t,a,r,n,i){void 0===i&&(i=Promise);var o=new E(u(t,a,r,n),i);return e.isGeneratorFunction(a)?o:o.next().then((function(e){return e.done?e.value:o.next()}))},y(b),c(b,l,"Generator"),c(b,i,(function(){return this})),c(b,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),a=[];for(var r in t)a.push(r);return a.reverse(),function e(){for(;a.length;){var r=a.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},e.values=x,L.prototype={constructor:L,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(O),!e)for(var t in this)"t"===t.charAt(0)&&a.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(a,r){return o.type="throw",o.arg=e,t.next=a,r&&(t.method="next",t.arg=void 0),!!r}for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n],o=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var l=a.call(i,"catchLoc"),c=a.call(i,"finallyLoc");if(l&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=e,o.arg=t,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(o)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),d},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var a=this.tryEntries[t];if(a.finallyLoc===e)return this.complete(a.completion,a.afterLoc),O(a),d}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var a=this.tryEntries[t];if(a.tryLoc===e){var r=a.completion;if("throw"===r.type){var n=r.arg;O(a)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,a){return this.delegate={iterator:x(e),resultName:t,nextLoc:a},"next"===this.method&&(this.arg=void 0),d}},e}var P=function(e){Object(m.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(h.a)(this,a);for(var r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];return(e=t.call.apply(t,[this].concat(n))).state={berita:[],editBeritaModalVisible:!1,editBeritaModalLoading:!1,currentRowData:{},addBeritaModalVisible:!1,addBeritaModalLoading:!1,searchKeyword:""},e.getBerita=Object(p.a)(F().mark((function t(){var a,r,n,i;return F().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,B();case 2:a=t.sent,console.log(a),r=a.data,n=r.content,200===r.statusCode&&(i=n.filter((function(t){var a=t.judul,r=t.pembuat,n=e.state.searchKeyword.toLowerCase(),i="string"===typeof r;return"string"===typeof a&&a.toLowerCase().includes(n)||i&&r.toLowerCase().includes(n)})),e.setState({berita:i}));case 6:case"end":return t.stop()}}),t)}))),e.handleSearch=function(t){e.setState({searchKeyword:t},(function(){e.getBerita()}))},e.handleEditBerita=function(t){e.setState({currentRowData:Object.assign({},t),editBeritaModalVisible:!0})},e.handleDeleteBerita=function(t){var a=t.idBerita;d.a.confirm({title:"Konfirmasi",content:"Apakah Anda yakin ingin menghapus data ini?",okText:"Ya",okType:"danger",cancelText:"Tidak",onOk:function(){k({idBerita:a}).then((function(t){s.a.success("Berhasil dihapus"),e.getBerita()}))}})},e.handleEditBeritaOk=function(t){var a=e.editBeritaFormRef.props.form;a.validateFields((function(t,r){t||(e.setState({editModalLoading:!0}),w(r,r.idBerita).then((function(t){a.resetFields(),e.setState({editBeritaModalVisible:!1,editBeritaModalLoading:!1}),s.a.success("Berhasil diedit!"),e.getBerita()})).catch((function(e){s.a.success("Pengeditan gagal, harap coba lagi!")})))}))},e.handleCancel=function(t){e.setState({editBeritaModalVisible:!1,addBeritaModalVisible:!1})},e.handleAddBerita=function(t){e.setState({addBeritaModalVisible:!0})},e.handleAddBeritaOk=function(t){var a=e.addBeritaFormRef.props.form;a.validateFields((function(t,r){t||(e.setState({addBeritaModalLoading:!0}),E(r).then((function(t){a.resetFields(),e.setState({addBeritaModalVisible:!1,addBeritaModalLoading:!1}),s.a.success("Berhasil menambahkan!"),e.getBerita()})).catch((function(e){s.a.success("Gagal menambahkan, harap coba lagi!")})))}))},e}return Object(f.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.getBerita(),Object(T.a)().then((function(t){e.setState({user:t.data})})).catch((function(e){console.error("Terjadi kesalahan saat mengambil data user:",e)}))}},{key:"render",value:function(){var e=this,t=this.state,a=t.berita,s=t.searchKeyword,d=t.user,p=[{title:"Judul Berita",dataIndex:"judul",key:"judul"},{title:"Tanggal Pembuatan",dataIndex:"tglPembuatan",key:"tglPembuatan"},{title:"Isi Berita",dataIndex:"isiBerita",key:"isiBerita"},{title:"Creator",dataIndex:"pembuat",key:"pembuat"},{title:"Foto Berita",dataIndex:"fotoBerita",key:"fotoBerita",render:function(e,t){return b.a.createElement("img",{src:"".concat(_.a).concat(t.fotoBerita),width:200,height:150})}}],h=function(){return d&&"ROLE_ADMINISTRATOR"===d.role&&p.push({title:"Operasi",key:"action",width:120,align:"center",render:function(t,a){return b.a.createElement("span",null,b.a.createElement(c.a,{type:"primary",shape:"circle",icon:"edit",title:"Edit",onClick:function(){return e.handleEditBerita(a)}}),b.a.createElement(i.a,{type:"vertical"}),b.a.createElement(c.a,{type:"primary",shape:"circle",icon:"delete",title:"Delete",onClick:function(){return e.handleDeleteBerita(a)}}))}}),p},f=b.a.createElement(o.a,{gutter:[16,16],justify:"start"},d&&"ROLE_ADMINISTRATOR"===d.role?b.a.createElement(o.a,{gutter:[16,16],justify:"start",style:{paddingLeft:9}},b.a.createElement(l.a,{xs:24,sm:12,md:8,lg:6,xl:6},b.a.createElement(c.a,{type:"primary",onClick:e.handleAddBerita},"Tambah Berita"))):null,b.a.createElement(l.a,{xs:24,sm:12,md:8,lg:6,xl:6},b.a.createElement(n.a,{placeholder:"Cari data",value:s,onChange:function(t){return e.handleSearch(t.target.value)},style:{width:235,marginRight:10}}))),m=(d?d.role:"").role;console.log("peran pengguna:",m);return b.a.createElement("div",{className:"app-container"},b.a.createElement(O.a,{title:"Manajemen Data Berita",source:"Di sini, Anda dapat mengelola daftar berita di sistem."}),b.a.createElement("br",null),b.a.createElement(r.a,{title:f,style:{overflowX:"scroll"}},d&&"ROLE_PETERNAK"===d.role?b.a.createElement(u.a,{dataSource:a,bordered:!0,columns:p}):(d&&d.role,b.a.createElement(u.a,{dataSource:a,bordered:!0,columns:p&&h()}))),b.a.createElement(M,{currentRowData:this.state.currentRowData,wrappedComponentRef:function(t){return e.editBeritaFormRef=t},visible:this.state.editBeritaModalVisible,confirmLoading:this.state.editBeritaModalLoading,onCancel:this.handleCancel,onOk:this.handleEditBeritaOk}),b.a.createElement(I,{wrappedComponentRef:function(t){return e.addBeritaFormRef=t},visible:this.state.addBeritaModalVisible,confirmLoading:this.state.addBeritaModalLoading,onCancel:this.handleCancel,onOk:this.handleAddBeritaOk}))}}]),a}(v.Component);t.default=P},694:function(e,t,a){"use strict";t.a="http://37.128.248.23:50458/downloadFile/"}}]);