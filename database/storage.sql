-- =====================================================================
-- storage.sql – Kho ảnh cho bài viết, sản phẩm, công trình (Supabase Storage)
-- Chạy SAU schema.sql: Supabase → SQL Editor → New query → dán → Run
-- Tạo kho "anh-web" công khai: ai cũng XEM được ảnh, chỉ admin đăng nhập mới TẢI LÊN / SỬA / XÓA.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('anh-web', 'anh-web', true)
on conflict (id) do nothing;

drop policy if exists "anh_web_admin_them" on storage.objects;
create policy "anh_web_admin_them" on storage.objects
  for insert to authenticated with check (bucket_id = 'anh-web');

drop policy if exists "anh_web_admin_sua" on storage.objects;
create policy "anh_web_admin_sua" on storage.objects
  for update to authenticated using (bucket_id = 'anh-web');

drop policy if exists "anh_web_admin_xoa" on storage.objects;
create policy "anh_web_admin_xoa" on storage.objects
  for delete to authenticated using (bucket_id = 'anh-web');
