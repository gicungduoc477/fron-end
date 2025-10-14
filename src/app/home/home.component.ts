import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Books } from '../book';
import { BookService } from '../services/book.service';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy { 

  books: Books[] = [];
  filteredBooks: Books[] = [];
  items = [  ]; 
  categories: any[] = []; 
  selectedCategory: string = 'TẤT CẢ EBOOK';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  
  //  Quản lý Subscription để tránh rò rỉ bộ nhớ
  private searchSubscription!: Subscription; 

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // 1. Lấy sách và khởi tạo danh sách
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      this.filteredBooks = [...this.books];
      this.categories = this.bookService.getCategories();
      this.filterBooks();
    });

    //  Đăng ký theo dõi tìm kiếm và lưu vào biến
    this.searchSubscription = this.bookService.searchQuery$.subscribe(query => {
      const lowerQuery = query.toLowerCase();
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(lowerQuery)
      );
      this.currentPage = 1; // Reset trang
    });
  }

  //  Hủy đăng ký khi component bị hủy → NGĂN CHẶN MEMORY LEAK
  ngOnDestroy(): void {
    if (this.searchSubscription) {
        this.searchSubscription.unsubscribe();
    }
  }

  // --- Logic Danh mục & Lọc Sách ---
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterBooks();
  }

  filterBooks(): void {
    const selected = this.selectedCategory.trim().toLowerCase();
    this.filteredBooks = (selected === 'tất cả ebook') 
      ? [...this.books] // Hiển thị tất cả
      : this.books.filter(book => book.category.trim().toLowerCase() === selected); // Lọc theo category
    this.currentPage = 1;
  }

  // --- Logic Tính toán ---
  /**
   *  Ép kiểu rõ ràng thành Number và làm tròn để tránh lỗi thập phân
   */
  discountPrice(price: any, discount: any): number {
    const p = parseFloat(price);
    const d = parseFloat(discount);
    if (isNaN(p) || isNaN(d)) return 0; // Trả về 0 nếu không hợp lệ
    return Math.round(p - (p * (d / 100))); 
  }

  // --- Logic Phân trang (Getters) ---
  get totalPages(): number {
    //  Đảm bảo ít nhất là 1 trang
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage) || 1;
  }

  get currentBooks(): Books[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  //  Logic hiển thị phân trang (giữ nguyên vì đã tốt)
  getPagination(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pageNumbers: (number | string)[] = [];
    // ... (Logic phân trang rút gọn: 1 ... 4 5 6 ... 10)
    
    // Tối giản logic bằng cách gọi hàm gốc 
    if (total <= 5) {
        for (let i = 1; i <= total; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1); 
        if (current > 3) pageNumbers.push("...");
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
        for (let i = start; i <= end; i++) {
            if (!pageNumbers.includes(i)) pageNumbers.push(i);
        }
        if (current < total - 2) pageNumbers.push("...");
        if (total !== 1 && !pageNumbers.includes(total)) pageNumbers.push(total);
    }

    return pageNumbers;
  };

  setCurrentPage(page: number | string): void {
    if (typeof page === "number" && page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}