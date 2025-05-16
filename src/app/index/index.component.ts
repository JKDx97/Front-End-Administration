import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetalleService } from '../detalle.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [FormsModule, CommonModule, NgChartsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  productosLabels: string[] = [];
  productosData: number[] = [];

  chartType: ChartType = 'bar';

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  constructor(private detalleService: DetalleService) {}

  ngOnInit(): void {
    this.getTop(); // Cargar datos automáticamente al iniciar
  }

  get chartData() {
    return {
      labels: this.productosLabels,
      datasets: [
        {
          label: 'Productos más vendidos',
          data: this.productosData,
          backgroundColor: [
            '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC',
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
          ],
        },
      ],
    };
  }

  getTop() {
    this.detalleService.getTop().subscribe((data) => {
      this.productosLabels = data.map((item) => item.producto);
      this.productosData = data.map((item) => item.total_vendidos);
    });
  }
}
