import { Button, Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getKandangByPeternak } from "../../../api/kandang";

const ViewPeternakForm = ({
  viewRowData,
  viewPeternakModalVisible,
  handleViewModalCancel,
}) => {
  const [kandang, setKandang] = useState("");

  const fetchKandangByPeternak = useCallback(async () => {
    try {
      const response = await getKandangByPeternak(viewRowData?.idPeternak);

      setKandang(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [viewRowData.idPeternak]);

  useEffect(() => {
    fetchKandangByPeternak();
  }, [fetchKandangByPeternak]);

  console.log(kandang);
  

  return (
    <Modal
      title="Detail Peternak"
      visible={viewPeternakModalVisible}
      onCancel={handleViewModalCancel}
      footer={[
        <Button key="back" onClick={handleViewModalCancel}>
          Tutup
        </Button>,
      ]}
    >
      <p>
        <strong>NIK:</strong> {viewRowData.nikPeternak}
      </p>
      <p>
        <strong>Nama:</strong> {viewRowData.namaPeternak}
      </p>
      <p>
        <strong>Lokasi:</strong> {viewRowData.lokasi}
      </p>
      <p>
        <strong>Petugas Pendaftar:</strong> {viewRowData.petugas?.namaPetugas}
      </p>
      <p>
        <strong>Tanggal Pendaftaran:</strong> {viewRowData.tanggalPendaftaran}
      </p>
      <strong>ID Kandang:</strong>
      <ul>
        {kandang?.content?.map((values, index) => {
          const { nikPeternak } = values;
          return <li key={index}>{nikPeternak}</li>;
        })}
      </ul>
    </Modal>
  );
};

export default ViewPeternakForm;
