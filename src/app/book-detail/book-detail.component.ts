import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {
  bookId!: string;
  bookDetail: any;
  quantity: number = 1;

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute
   
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
     this.bookService.getBookId(this.bookId).subscribe(data=>{
      this.bookDetail = data
     });
  }

  discountPrice(price: any, discount: any) {
    return price - price * (parseFloat(discount) / 100);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  
}
