import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-reject-dialog',
  templateUrl: './product-reject-dialog.component.html',
  styleUrls: ['./product-reject-dialog.component.scss'],
})
export class ProductRejectDialogComponent {
  public data = {
    title: 'Razones del rechazo',
    ok: 'Enviar',
    options: [
      {
        id: 0,
        status: false,
        name: 'No podes compartir datos de contacto en la publicación.',
      },
      {
        id: 1,
        status: false,
        name: 'Revisa tu precio. Recordá que las publicaciones se hacen en dólares.',
      },
      {
        id: 2,
        status: false,
        name: 'No podes poner imagenes explicitas o con datos de contacto.',
      },
      {
        id: 3,
        status: false,
        name: 'Tu publicación esta mal segmentada.',
      },
    ],
  };

  public customMessage = false;
  public message = '';

  constructor(public dialogRef: MatDialogRef<ProductRejectDialogComponent>) {}

  onNoClick(): void {
    const selectedReasons = this.data.options
      .filter((item) => item.status)
      .map((item) => item.name);
    if (this.customMessage && this.message) {
      selectedReasons.push(this.message);
    }
    this.dialogRef.close({ selectedReasons });
  }
}
