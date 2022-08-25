function getBreadcrumbFromSecond(path) {
    let paths = [];

    console.log(path)

    switch (path) {
        case '/admin/employees/edit': {
            paths = ['Quản lý nhân viên', 'Cập nhật nhân viên'];
            break;
        }
        case '/admin/employees/view': {
            paths = ['Quản lý nhân viên', 'Danh sách nhân viên'];
            break;
        }
        case '/admin/orders/comfirm': {
            paths = ['Quản lý đơn hàng', 'Xác nhận đơn hàng'];
            break;
        }
        case '/admin/orders/edit': {
            paths = ['Quản lý đơn hàng', 'Cập nhật đơn hàng'];
            break;
        }
        case '/admin/orders/view': {
            paths = ['Quản lý đơn hàng', 'Danh sách đơn hàng'];
            break;
        }
        case '/admin/products/edit': {
            paths = ['Quản lý sản phẩm', 'Cập nhật sản phẩm'];
            break;
        }
        case '/admin/products/view': {
            paths = ['Quản lý sản phẩm', 'Danh sách sản phẩm'];
            break;
        }
        case '/admin/positions/edit': {
            paths = ['Quản lý chức vụ', 'Cập nhật chức vụ'];
            break;
        }
        case '/admin/positions/view': {
            paths = ['Quản lý chức vụ', 'Danh sách chức vụ'];
            break;
        }
        case '/admin/receipts/edit': {
            paths = ['Quản lý phiếu nhập kho', 'Cập nhật phiếu nhập kho'];
            break;
        }
        case '/admin/receipts/view': {
            paths = ['Quản lý phiếu nhập kho', 'Danh sách phiếu nhập kho'];
            break;
        }
        case '/admin/categories/edit': {
            paths = ['Quản lý danh mục', 'Cập nhật danh mục'];
            break;
        }
        case '/admin/categories/view': {
            paths = ['Quản lý danh mục', 'Danh sách danh mục'];
            break;
        }
        case '/admin/brands/edit': {
            paths = ['Quản lý thương hiệu', 'Cập nhật thương hiệu'];
            break;
        }
        case '/admin/brands/view': {
            paths = ['Quản lý thương hiệu', 'Danh sách thương hiệu'];
            break;
        }
        case '/admin/users/edit': {
            paths = ['Quản lý người dùng', 'Cập nhật người dùng'];
            break;
        }
        case '/admin/users/view': {
            paths = ['Quản lý người dùng', 'Danh sách người dùng'];
            break;
        }
        case '/admin/dashboard': {
            paths = ['Dashboard'];
            break;
        }
    }

    return paths;
}

export { getBreadcrumbFromSecond };