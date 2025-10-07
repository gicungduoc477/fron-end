import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Books } from '../book';
import { BookService } from '../services/book.service'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  // Danh sách tất cả sách lấy từ service
  books: Books[] = [];

  // Danh sách sách sau khi lọc (theo thể loại hoặc tìm kiếm)
  filteredBooks: Books[] = [];

  // Ảnh hiển thị trong carousel trang chủ
  items = [
    { image: '/image/carousel1.jpg' },
    { image: '/image/carousel2.jpg' },
    { image: '/image/carousel3.jpg' }
  ];

  // Mảng chứa danh sách thể loại (category)
  categories: any[] = [];

  // Thể loại đang được chọn (mặc định là tất cả)
  selectedCategory: string = 'TẤT CẢ EBOOK';

  // Biến dùng cho phân trang
  currentPage: number = 1;     // Trang hiện tại
  itemsPerPage: number = 8;    // Số sản phẩm trên mỗi trang

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    // 1️⃣ Lấy dữ liệu sách từ service
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
      this.filteredBooks = this.books; // Ban đầu hiển thị tất cả sách
    });

    // 2️⃣ Lấy danh sách thể loại từ service
    this.categories = this.bookService.getCategories();

    // 3️⃣ Lọc sách theo thể loại đang chọn (mặc định: tất cả)
    this.filterBooks();

    // 4️⃣ Theo dõi sự thay đổi của ô tìm kiếm từ BookService
    // Khi người dùng gõ vào ô tìm kiếm, filteredBooks sẽ tự cập nhật
    this.bookService.searchQuery$.subscribe(query => {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
    });

    // 5️⃣ Đặt lại trang hiện tại là 1 mỗi khi khởi động
    this.currentPage = 1;
  }

  // Khi người dùng chọn 1 thể loại
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterBooks();
  }

  // Lọc danh sách sách theo thể loại được chọn
  filterBooks() {
    const selected = this.selectedCategory.trim().toLowerCase();

    if (selected === 'tất cả ebook') {
      // Nếu chọn "TẤT CẢ EBOOK" thì hiển thị toàn bộ sách
      this.filteredBooks = this.books;
    } else {
      // Lọc sách theo thể loại trùng khớp
      this.filteredBooks = this.books.filter(book =>
        book.category.trim().toLowerCase() === selected
      );
    }
    this.currentPage = 1; // Reset lại trang đầu tiên
  }

  // Tính giá sau khi giảm
  discountPrice(price: any, discount: any) {
    return price - (price * (parseFloat(discount) / 100));
  }

  // Getter: Tính tổng số trang (dựa vào số lượng filteredBooks)
  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }

  // Getter: Lấy danh sách sách của trang hiện tại
  get currentBooks(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Hàm tạo danh sách phân trang hiển thị (ví dụ: 1 ... 3 4 5 ... 10)
  getPagination(): (number | string)[] {
    const pageNumbers = [];

    if (this.totalPages <= 5) {
      // Nếu tổng số trang <= 5 thì hiển thị hết
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Nếu có nhiều trang → hiển thị rút gọn dạng có dấu "..."
      if (this.currentPage > 3) pageNumbers.push(1, "...");
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (this.currentPage < this.totalPages - 2) pageNumbers.push("...", this.totalPages);
    }
    return pageNumbers;
  };

  // Cập nhật trang hiện tại khi người dùng bấm nút chuyển trang
  setCurrentPage(page: number | string): void {
    if (
      typeof page === "number" &&
      page > 0 &&
      page <= this.totalPages &&
      page !== this.currentPage
    ) {
      this.currentPage = page;
    }
  }
}
