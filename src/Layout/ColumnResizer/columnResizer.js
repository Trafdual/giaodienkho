// columnResizer.js

export function enableColumnResizing(tableSelector) {
    document.querySelectorAll(`${tableSelector} thead th`).forEach(header => {
      const resizer = document.createElement('div');
      resizer.style.width = '5px';
      resizer.style.height = '100%';
      resizer.style.position = 'absolute';
      resizer.style.right = '0';
      resizer.style.top = '0';
      resizer.style.cursor = 'col-resize';
  
      header.style.position = 'relative';
      header.appendChild(resizer);
  
      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
  
        let startX = e.pageX;
        let startWidth = parseInt(document.defaultView.getComputedStyle(header).width, 10);
  
        const onMouseMove = (e) => {
          let width = startWidth + (e.pageX - startX);
          header.style.width = `${width}px`;
  
          // Điều chỉnh tất cả các cột tương ứng trong tbody theo chiều rộng của header
          let index = Array.from(header.parentElement.children).indexOf(header);
          document.querySelectorAll(`${tableSelector} tbody tr td:nth-child(${index + 1})`).forEach(cell => {
            cell.style.width = `${width}px`;
          });
        };
  
        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
  
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  }
  