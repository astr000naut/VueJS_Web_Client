<template>
  <div class="sidebar">
    <div class="sidebar__main">
      <div class="sidebar__item">
        <div class="item__icon mi mi-24 mi-sidebar-dashboard"></div>
        <div class="item__text" data-text="Tổng quan">Tổng quan</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Tổng quan</div>
        </div>
      </div>
      <div class="sidebar__item item--profile">
        <div class="item__icon mi mi-24 mi-sidebar-cash"></div>
        <div class="item__text" data-text="Tiền mặt">Tiền mặt</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Tiền mặt</div>
        </div>
      </div>

      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-bank"></div>
        <div class="item__text" data-text="Tiền gửi">Tiền gửi</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Tiền gửi</div>
        </div>
      </div>
      <div class="sidebar__item item--overview">
        <div class="item__icon mi mi-24 mi-sidebar-pu"></div>
        <div class="item__text" data-text="Mua hàng">Mua hàng</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Mua hàng</div>
        </div>
      </div>
      <div class="sidebar__item item--profile">
        <div class="item__icon mi mi-24 mi-sidebar-sale"></div>
        <div class="item__text" data-text="Bán hàng">Bán hàng</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Bán hàng</div>
        </div>
      </div>

      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-invoice"></div>
        <div class="item__text" data-text="Quản lý hóa đơn">
          Quản lý hóa đơn
        </div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Quản lý hóa đơn</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-stock"></div>
        <div class="item__text" data-text="Kho">Kho</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Kho</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-tools"></div>
        <div class="item__text" data-text="Công cụ dụng cụ">
          Công cụ dụng cụ
        </div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Công cụ dụng cụ</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-fixed-assets"></div>
        <div class="item__text" data-text="Tài sản cố định">
          Tài sản cố định
        </div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Tài sản cố định</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-tax"></div>
        <div class="item__text" data-text="Thuế">Thuế</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Thuế</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-price"></div>
        <div class="item__text" data-text="Giá thành">Giá thành</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Giá thành</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-general"></div>
        <div class="item__text" data-text="Tổng hợp">Báo cáo</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Báo cáo</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-budget"></div>
        <div class="item__text" data-text="Ngân sách">Báo cáo</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Báo cáo</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-report"></div>
        <div class="item__text" data-text="Báo cáo">Báo cáo</div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Báo cáo</div>
        </div>
      </div>
      <div class="sidebar__item item--contract">
        <div class="item__icon mi mi-24 mi-sidebar-finance"></div>
        <div class="item__text" data-text="Phân tích tài chính">
          Phân tích tài chính
        </div>
        <div class="item__hoverbox display--none">
          <div class="hover__arrow"></div>
          <div class="hover__text">Phân tích tài chính</div>
        </div>
      </div>
    </div>
    <div class="sidebar__footer">
      <div class="item__icon mi mi-24 mi-sidebar-left-arrow"></div>
      <div class="item__text" data-text="Thu gọn">Thu gọn</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.sidebar {
  flex-basis: 200px;
  flex-shrink: 0;
  height: calc(100vh - 56px);
  font-weight: 400;
  background-color: #393a3d;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  transform: translate3d(0, 0, 0);
  z-index: 20;
}

.sidebar__main {
  max-height: calc(100vh - 56px - 44px);
  row-gap: 4px;
  padding: 20px 12px 12px 12px;
  overflow-y: scroll;
}

.sidebar__main::-webkit-scrollbar {
  width: 4px;
  background-color: transparent;
}

.sidebar__main::-webkit-scrollbar-thumb {
  background-color: var(--clr-t-border);
}

.sidebar__item {
  height: 44px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  padding-left: 12px;
  column-gap: 12px;
  color: #fff;
}

.sidebar .item__text {
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
}

.sidebar__footer {
  height: 44px;
  width: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  padding-left: 24px;
  column-gap: 12px;
  border-top: 1px solid var(--clr-t-setext);
}

.item__hoverbox {
  background-color: #393a3d;
  border-radius: 4px;
  padding: 12px;
  position: absolute;
  width: max-content;
  left: 85px;
}

.item__hoverbox .hover__arrow {
  width: 10px;
  height: 10px;
  background-color: #393a3d;
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.sidebar__item:hover {
  background-color: #616164;
  cursor: pointer;
}

.sidebar__footer:hover {
  background-color: #616164;
  cursor: pointer;
}

.sidebar__item--highlight {
  background-color: #58595d;
}
</style>
