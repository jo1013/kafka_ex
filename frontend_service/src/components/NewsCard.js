// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function NewsCard({ id, title, imageUrl }) {
//   const navigate = useNavigate();

//   // 클릭 이벤트 핸들러: 뉴스 상세 페이지로 이동
//   const handleClick = () => {
//     navigate(`/news/${id}`);
//   };

//   return (
//     <div onClick={handleClick} className="block cursor-pointer no-underline text-current transform transition duration-500 hover:scale-105">
//       <div className="overflow-hidden rounded-lg shadow-lg">
//         <img alt={title} src={imageUrl || 'your-default-image-url'} className="w-full h-48 object-cover"/>
//         <div className="p-4 bg-white">
//           <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
//           <p className="text-gray-600 text-sm">Click to read more...</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NewsCard;



// NewsCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function NewsCard({ id, title, imageUrl }) {
  const navigate = useNavigate();
  const defaultImage = 'https://council.gb.go.kr/images/common/gb_wait.png'; // 기본 이미지 URL

  const handleClick = () => {
    navigate(`/news/${id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer block no-underline text-current transform transition duration-300 hover:scale-105">
      <div className="overflow-hidden rounded-lg shadow-lg bg-white">
        <img
          alt={title}
          src={imageUrl || defaultImage}
          className="w-full h-48 object-cover" // 이미지 크기를 일관되게 유지
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">Click to read more...</p>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;
