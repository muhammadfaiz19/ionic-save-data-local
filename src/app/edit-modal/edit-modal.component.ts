import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators 
} from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
  IonContent, IonItem, IonInput, IonSelect, IonSelectOption, 
  IonText, ModalController 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, 
    IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonText
  ]
})
export class EditModalComponent implements OnInit {

  @Input() data: any; // Menerima data dari Home Page
  formMahasiswa!: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Inisialisasi Form dengan Validasi
    this.formMahasiswa = this.fb.group({
      nama: [this.data.nama, [Validators.required, Validators.minLength(5)]],
      nim: [this.data.nim, [Validators.required, Validators.pattern("^[0-9]*$")]],
      jurusan: [this.data.jurusan, [Validators.required]]
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  simpan() {
    if (this.formMahasiswa.valid) {
      // Kirim data balik ke Home Page bersama ID aslinya
      const updateData = {
        id: this.data.id, // ID PENTING: Jangan sampai hilang
        ...this.formMahasiswa.value
      };
      return this.modalCtrl.dismiss(updateData, 'confirm');
    }
    return;
  }
}