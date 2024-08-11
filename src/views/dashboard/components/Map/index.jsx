import React, { Component, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getKandang } from '@/api/kandang'; 
import {getHewans} from '@/api/hewan';
import pinKandang from '../../../../assets/images/pinKandang.png';
import pinSapi from '../../../../assets/images/pinSapi.png';

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kandang: [],
      hewans: [],
    };
  }

  fetchKandangList = async () => {
    try {
      const result = await getKandang();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({
          kandang: content
        });
        console.log(content);
      }
    } catch (error) {
      console.error("Error fetching study program data: ", error);
    }
  };

  fetchHewanList = async () => {
    try {
      const result = await getHewans();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({
          hewans: content
        });
        console.log(content);
      }
    } catch (error) {
      console.error("Error fetching hewan data: ", error);
    }
  };
  async componentDidMount() {
    this.fetchKandangList();
    this.fetchHewanList();
  }

  render() {
    const position = [-8.133220, 113.222603];
    const { kandang, hewans } = this.state;
    
    const pinKdg = L.icon({
      iconUrl: pinKandang,
      iconSize: [64, 64],
      iconAnchor: [48, 64],
    });
    const pinHewan = L.icon({
      iconUrl: pinSapi,
      iconSize: [64, 64],
      iconAnchor: [48, 64],
    }); 
  
    return (
      <MapContainer center={position} zoom={11.5} style={{ width: 1200, height: 600 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
  
  { kandang.map((kdg, index) => {
  const kdgLatitude = parseFloat(kdg.latitude);
  const kdgLongitude = parseFloat(kdg.longitude);
  const idKandang = kdg.idKandang;
  const luas = kdg.luas;
  const kapasitas = kdg.kapasitas;
  const nilaiBangunan = kdg.nilaiBangunan;

  const jumlahHewan = hewans.filter(hwn => {return hwn.kandang.idKandang === idKandang;
          }).length;

  if (!isNaN(kdgLatitude) && !isNaN(kdgLongitude)) {
    return (
      <Marker key={`kandang-${index}`} position={[kdgLatitude, kdgLongitude]} icon={pinKdg}>
        <Popup>
          <div>ID Kandang : {idKandang}</div>
          <div>Luas : {luas}</div>
          <div>Kapasitas : {kapasitas}</div>
          <div>Jumlah Hewan : {jumlahHewan}</div>
          <div>Nilai Bangunan : {nilaiBangunan}</div>
        </Popup>
      </Marker>
    );
  }
  return null;
})}
{ hewans.map((hwn, index) => {
  const hwnLatitude = parseFloat(hwn.latitude);
  const hwnLongitude = parseFloat(hwn.longitude);
  const kodeEartagNasional = hwn.kodeEartagNasional;
  const namaPeternak = hwn.peternak.namaPeternak;
  const nikPeternak = hwn.peternak.nikPeternak;

  if (!isNaN(hwnLatitude) && !isNaN(hwnLongitude)) {
    return (
      <Marker key={`hewan-${index}`} position={[hwnLatitude, hwnLongitude]} icon={pinHewan}>
        <Popup>
        <div>Eartag Hewan : {kodeEartagNasional}</div>
          <div>Nama Peternak : {namaPeternak}</div>
          <div>NIK Peternak : {nikPeternak}</div>
        </Popup>
      </Marker>
    );
  }
  return null;
})}
      </MapContainer>
    );
  }
}

export default connect((state) => state.app)(Map);
