// src/Admin/pagesAD/Banner/BannerContext.js

export const bannerState = {
  banners: [],   // danh sách banner từ DB
  loading: false,
};

export const bannerReducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, loading: action.payload };

    case "fetchBannerAndChangeState":
      return { ...state, banners: action.payload };

    case "addBanner":
      return { ...state, banners: [action.payload, ...state.banners] };

    case "deleteBanner":
      return {
        ...state,
        banners: state.banners.filter((b) => b._id !== action.payload),
      };

    default:
      return state;
  }
};
