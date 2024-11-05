import './Loading.scss';

function Loading() {
  return (
    <div className='loading-overlay'>
      <div className='loading-container'>
        <div className='spinner'></div>
        <p className='h3loading'>Đang lấy dữ liệu...</p>
      </div>
    </div>
  );
}

export default Loading;
