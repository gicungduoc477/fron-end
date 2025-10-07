import { Injectable } from '@angular/core';
import { Books } from '../book'; 
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  categories: any[] = [
{ "name": 'TẤT CẢ EBOOK', "icon": '' },
{ "name": 'Doremon', "icon": '/image/danhmuc1.png' },
{"name": '7 viên ngọc rồng', "icon": '/image/danhmuc2.png'},
{ "name": 'Conan', "icon": '/image/danhmuc3.png'},
{ "name": 'Naruto', "icon": '/image/danhmuc4.png'},
{ "name": 'Mushoku Tensei', "icon": '/image/danhmuc5.png'},
{ "name": 'One Punch Man', "icon": '/image/danhmuc6.png'},
{ "name": 'Jujutsu Kaisen', "icon": '/image/danhmuc7.png'},
];
private apiUrl = 'http://localhost:3000/books';
  books: Books[] = []//đưa dữ liệu book vào đây
constructor(private http:HttpClient) { }
//lấy thể loại
getCategories() {
return this.categories;
}
//lấy danh sách 
getBooks():Observable <Books[]> {
return this.http.get<Books[]>(this.apiUrl);
}
getBookId(id: any) : Observable<Books>{
  return this.http.get<Books>(`${this.apiUrl}/${id}`);
}
//hàm chỉnh sửa lại tìm kiếm
private searchQuerySubject = new BehaviorSubject<string>('');
searchQuery$ = this.searchQuerySubject.asObservable();
setSearchQuery(query: string) {
if (query !== null && query !== undefined) {
this.searchQuerySubject.next(query.trim());
}
}


 
}
