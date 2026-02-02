import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DataMahasiswaService {

  private KEY_MAHASISWA = 'data_mahasiswa_app';

  constructor() { }

  // 1. Ambil Data
  async getData() {
    const { value } = await Preferences.get({ key: this.KEY_MAHASISWA });
    return value ? JSON.parse(value) : [];
  }

  // 2. Tambah Data
  async tambahData(mahasiswaBaru: any) {
    const dataLama = await this.getData();
    mahasiswaBaru.id = Date.now();
    dataLama.push(mahasiswaBaru);
    return await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataLama)
    });
  }

  // 3. Hapus Data
  async hapusData(id: number) {
    const dataLama = await this.getData();
    const dataBaru = dataLama.filter((mhs: any) => mhs.id !== id);
    return await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataBaru)
    });
  }

  // 4. Update Data (FITUR BARU)
  async updateData(mahasiswaEdit: any) {
    const dataLama = await this.getData();
    
    // Cari index data berdasarkan ID
    const index = dataLama.findIndex((m: any) => m.id === mahasiswaEdit.id);
    
    // Jika ketemu, update datanya
    if (index !== -1) {
      dataLama[index] = mahasiswaEdit;
    }

    // Simpan kembali
    return await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataLama)
    });
  }
}