import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { 
  IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, 
  IonButtons, IonButton, IonFab, IonFabButton, IonIcon, 
  AlertController, ModalController // 1. Import ModalController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';
import { DataMahasiswaService } from '../services/data-mahasiswa.service';
import { EditModalComponent } from '../edit-modal/edit-modal.component'; // 2. Import Component Modal

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonButtons, IonButton, IonFab, IonFabButton, IonIcon],
})
export class HomePage {

  dataMahasiswa: any[] = [];

  constructor(
    private dataService: DataMahasiswaService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController // 3. Inject ModalController
  ) {
    addIcons({ add, trash, create });
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.dataMahasiswa = await this.dataService.getData();
    this.cdr.detectChanges();
  }

  bukaDetail(id: number) {
    this.router.navigate(['/detail', id]);
  }

  // --- FITUR EDIT DENGAN MODAL (SELECT OPTION) ---
  async editData(event: any, mhs: any) {
    event.stopPropagation(); // Cegah pindah halaman

    const modal = await this.modalController.create({
      component: EditModalComponent,
      componentProps: {
        data: mhs // Kirim data saat ini ke modal
      }
    });

    modal.onDidDismiss().then(async (result) => {
      // Jika tombol Simpan ditekan (role === 'confirm')
      if (result.role === 'confirm') {
        // Ambil data dari modal dan update ke service
        await this.dataService.updateData(result.data);
        // Refresh halaman
        this.loadData();
      }
    });

    return await modal.present();
  }

  // --- FITUR HAPUS ---
  async konfirmasiHapus(event: any, id: number) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        { 
          text: 'Hapus', 
          role: 'confirm',
          handler: async () => {
            await this.dataService.hapusData(id);
            this.loadData();
          }
        }
      ]
    });
    await alert.present();
  }
}