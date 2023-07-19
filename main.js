// Khai báo

// tìm trên màn hình có element nào có id là canvas không
const canvas = document.getElementById('canvas');
// khai báo canvas 
const ctx = canvas.getContext('2d');
// khai báo biến ảnh
const img = new Image();
// gán vị trí ảnh
img.src = "game.png";

// general settings ( cài đặt chung )

// biến điều khiển game dừng hoặc đang chơi
let gamePlaying = false;
// trọng lực
const gravity = .5;
// tốc độ
const speed = 4.2;
// chiều dài, chiều rộng của vật thể
const size = [51, 36];
// vận tốc nhảy
const jump = -8.5;
// khoảng cách của các ống
const cTenth = (canvas.width / 10);

// khai báo chung
let index = 0,
  bestScore = 0,
  flight,
  flyHeight,
  currentScore,
  pipe;

// pipe settings ( cài đặt đường ống )

// độ rộng của ổng
const pipeWidth = 78;
// khoảng cách giữa ống trên và dưới
const pipeGap = 220;
// random vị trí của ống trên trục dọc
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;
console.log((Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)))
// hàm khởi tạo game
const setup = () => {
   // set điểm mặc định
  currentScore = 0;
  // khai báo vận tốc
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  // đặt flyHeight ban đầu (giữa màn hình - kích thước của vật thể (con tuần lộc))
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes ( khởi tạo 3 ống đầu tiên )
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // make the pipe and bird moving (làm cho ống và vật thể di chuyển)
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part (background đầu)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part (background thứ 2)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);

  // pipe display (hiển thị ống)
  if (gamePlaying) {
    pipes.map(pipe => {
      // pipe moving (làm cho ống di chuyển)
      pipe[0] -= speed;

      // top pipe (vẽ ống trên)
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe (vẽ ống dưới)
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe (+ 1 điểm và tạo ống mới)
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        // check if it's the best score (kiểm tra xem có phải điểm cao nhất không)
        bestScore = Math.max(bestScore, currentScore);

        // remove & create new pipe (bỏ và khởi tạo ống mới)
        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }

      // if hit the pipe, end (check nếu đụng trúng ống, end game)
      if ([
        // kiểm tra xem cạnh trái của ống có chạm hoặc vượt qua cạnh phải của con chim hay không.
        pipe[0] <= cTenth + size[0],
        // kiểm tra xem cạnh phải của ống có chạm hoặc vượt qua cạnh trái của con chim hay không.
        pipe[0] + pipeWidth >= cTenth,
         // kiểm tra xem con chim có va chạm với ống phía trên hoặc phía dưới hay không.
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
        // vòng lặp để chạy vào hảm kiểm tra
      ].every(elem => elem)) {
        // cho biến game bằng false -> kết thúc game
        gamePlaying = false;
        // chạy lại hàm khởi tạo game
        setup();
      }
    })
  }
  // vẽ vật thể
  // kiểm tra xem game có đang chạy không
  if (gamePlaying) {
     // img là đối tượng hình ảnh của con chim.
    // 432 là tọa độ x của hình ảnh trên tệp ảnh, để chọn phần của hình ảnh cần vẽ.
    // Math.floor((index % 9) / 3) * size[1] tính toán tọa độ y của hình ảnh trên tệp ảnh, để chọn phần của hình ảnh cần vẽ. Tính toán này dựa trên biến index để chọn một trong số ba khung hình của con chim, và kích thước của khung hình được lưu trữ trong mảng size.
    // ...size là các tham số width và height của hình ảnh cần vẽ.
    // cTenth và flyHeight là tọa độ x và y của con chim trên màn hình vẽ.
    // ...size là các tham số width và height của hình ảnh khi vẽ trên màn hình vẽ.
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    // cập nhật lại vận tốc flight của con chim dựa trên giá trị của biến gravity. Biến flight đại diện cho vận tốc di chuyển của con chim theo chiều dọc.
    flight += gravity;
     // cập nhật lại tọa độ y của con chim trên màn hình vẽ dựa trên giá trị của biến flight. 
    // Giá trị mới của flyHeight được tính bằng cách cộng flight vào giá trị hiện tại của flyHeight. 
    // Tuy nhiên, để đảm bảo rằng con chim không bay quá giới hạn của màn hình vẽ,
    // giá trị mới của flyHeight được giới hạn bởi chiều cao của màn hình vẽ trừ đi chiều cao của con chim.
    // Giá trị này được tính bằng cách sử dụng hàm Math.min().
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    // vẽ hình ảnh của vật thể lên canvas
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    // đặt vật thể ở giữa màn hình theo chiều dọc.
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    // text accueil (vẽ điểm cao lên màn hình)
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    // vẽ chữ click to play lên màn hình
    ctx.fillText('Click to play', 90, 535);
    // chỉnh font cho canvas
    ctx.font = "bold 30px courier";
  }
 
   // kiếm phần tử HTML có id là bestScore và cập nhật nội dung của phần tử đó thành chuỗi "Best : ${bestScore}". Biến bestScore chứa điểm số cao nhất đạt được trong trò chơi.
  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  // HTML có id là currentScore và cập nhật nội dung của phần tử đó thành chuỗi "Current : ${currentScore}". Biến currentScore chứa điểm số hiện tại của người chơi trong trò chơi.
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // kêu trình duyệt vẽ màn hình ra
  window.requestAnimationFrame(render);
}

// launch setup (khởi chạy)
setup();
// tải lên ảnh vào trình duyệt
img.onload = render;

// start game ( troi oi cai nay chỉnh sang space sao z tr met moi qua )
// lắng nghe sự kiện onclick (ấn vào màn hình) sau đó cho biến gamePlaying = true để khởi chạy game
document.addEventListener('click', () => gamePlaying = true);
// lắng nghe sự kiện nút bấm
document.addEventListener('keydown', (event) => {
  // event.keyCode == 32 là nút space, khi người dùng bấm space lúc gameplaying = false thì sẽ khởi chạy game luôn
  if (event.keyCode === 32) {
    gamePlaying = true;
  }
});  
// bắt sự kiện onlick để chạy hàm nhảy
window.onclick = () => flight = jump;
// bắt sự kiện nút ấn xuống để chạy hàm nhảy
document.onkeydown = (event) => {
   // keycode 32 là nút space
  if (event.keyCode === 32) {
    // nhảy
    flight = jump;
  }
};