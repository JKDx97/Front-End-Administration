import { Component, OnInit } from '@angular/core';
import { VentaService } from '../venta.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DetalleService } from '../detalle.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
})
export class VentaComponent implements OnInit {
  venta: any = null;
  dni: any = '';
  detalle: any[] = [];

  constructor(
    private ventaService: VentaService,
    private route: ActivatedRoute,
    private detalleService: DetalleService
  ) {}

  ngOnInit(): void {
    this.dni = this.route.snapshot.paramMap.get('dni') || '';
    this.getVentaDni(this.dni);
  }
  getVentaDni(dni: string) {
    this.ventaService.getVentaDni(dni).subscribe((data: any[]) => {
      this.venta = data[0];
      if (this.venta?.id) {
        this.getDetalle(this.venta.id);
      }
    });
  }

  getDetalle(venta_id: number) {
    this.detalleService.getDetalle(venta_id).subscribe((data: any) => {
      this.detalle = data;
      console.log(data);
    });
  }
}
