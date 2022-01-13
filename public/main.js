        $('#hi').click(function(){
            $('#hi').animate({
                marginLeft: '100px',
                marginTop: '100px'
            });
        })

        $('#email').on('change', function(){
            $('#email-alert').show();
        })

        $('form').on('submit', function(e){

            // if($('#email').val() == ''){
            //     e.preventDefault();
            //     $('#email-alert').show();
            // }
            // else if($('#password').val() == ''){
            //     e.preventDefault();
            //     $('#password-alert').show();
            // }

            var 입력한이메일 = $('#email').val();
            if(/\S+@\S+\.\S+/.test(입력한이메일) == false){
                e.preventDefault();
                $('#email-alert').show();
            } else if (입력한이메일 == '') {
                e.preventDefault();
            }

            // 입력한패스워드에 대문자가 있으면 true 없으면 false가 나온다
            var 입력한패스워드 = $('#password').val();
            if (/[A-Z]+/.test(입력한패스워드) == false ){
                e.preventDefault();
            }

        });

        $('#login').on('click', function(){
            // $('.black-background').fadeIn();

            // $('.black-background').show();
            // $('.black-background').animate({ marginTop: '0px' });

            // $('.black-background').show().animate({ marginTop: '0px' });

            // $('.black-background').css('transform', 'translateY(0px)');
            $('.black-background').addClass('slide-down');

        });

        $('#nav-sub-button').click(function(){
            $('.nav-sub').slideToggle();
        })

        $('#close').on('click', function(){
            $('.black-background').fadeOut();
        });

        var 지금보이는사진 =1;
       
        $('.slide-right').click(function() {

            if ( 지금보이는사진 < 3 ) { 
                $('.slide-container').css('transform', 'translateX(-' + 지금보이는사진 + '00vw)');
                지금보이는사진 = 지금보이는사진 + 1;
            }

        });   

        $('.slide-left').click(function() {
        
            if ( 지금보이는사진 > 1 ) { 
                $('.slide-container').css('transform', 'translateX(-' + (지금보이는사진 - 2) + '00vw)');
                지금보이는사진 = 지금보이는사진 - 1;
            }

        });

        $(window).on('scroll', function(){

             // console.log("스크롤 위치 :: ",$(window).scrollTop())
             
            if ( $(window).scrollTop() > 100 ){
                $('.nav-menu').addClass('nav-black');
                $('.nav-menu h4').addClass('small-logo');
            }
            else {
                $('.nav-menu').removeClass('nav-black');
                $('.nav-menu h4').removeClass('small-logo');
            }

        });

        // 반복문으로 탭열기
        // for (let i = 0; i < $('.tab-button').length; i++) {
        //     $('.tab-button').eq(i).click(function(){
        //         // console.log(i);
        //         탭열기(i);
        //     }); 
        // }

        //ul.list로 탭열기
        $('.list').click(function(e){
                탭열기(e.target.dataset.id);
        });

        

        function 탭열기(숫자) {
            $('.tab-button').removeClass('active'); 
            $('.tab-content').removeClass('show');    

            $('.tab-button').eq(숫자).addClass('active');
            $('.tab-content').eq(숫자).addClass('show');
        }

        $('.black-background').click(function(e){

            // e.target;  // 지금 실제로 클릭한 요소
            // e.currentTarget;  // 지금 이벤트리스너가 달린 곳
            // e.preventDefault(); // 기본동작 막기

            //만약에, 지금 실제로 클릭한게 검은배경일 때만 작동하도록하기.
            if (e.target === e.currentTarget ){
                $('.black-background').hide();
            }
        });


        let 셔츠사이즈 = [85,90,95,100,105,110,115];
        // select 값을 바꾸면 내부 코드를 실행해주세요
        // 만약에 사용자가 선택한 값이 셔츠인 경우에 밑에 그 UI를 보여준다.
        $('#option1').on('change', function(){
            // if ( $('#option1').val() == '셔츠' ) {
            //     $('.size-select').show();
            // }
            // else {
            //     $('.size-select').hide();
            // }

            if ( $('#option1').val() == '셔츠' ) {
                $('#option2').html('');
                for (let i =0; i < 셔츠사이즈.length; i++) {
                    let 템플릿 = `<option>${셔츠사이즈[i]}</option>`;
                    $('#option2').append(템플릿);
                }
            }
            else {
                $('#option2').html('');
                var 템플릿 = '<option>28</option><option>30</option><option>32</option>';
                $('#option2').append(템플릿);
            }
        });

        // array of objects 다루기
        let products = [
            { id : 0, price : 70000, title : 'Blossom Dress' },
            { id : 1, price : 50000, title : 'Springfield Shirt' },
            { id : 2, price : 60000, title : 'Black Monastery' }
        ] 
        for(let i =0; i < products.length; i++){
            $('.title').eq(i).html(products[i].title);
            $('.price').eq(i).html('가격 : '+products[i].price);
        }

        // 상품정렬 기능 만들기 (sort, filter, map)
        let array = [7,3,5,2,40];
        
        array.sort(function(a,b){
            return a - b; //오름차순
            // return b - a; //내림차순
        });

        $('#sortPrice').click(function(){
            products.sort(function(a,b){
                return a.price - b.price;
            })

            for(let i =0; i < products.length; i++){
            $('.title').eq(i).html(products[i].title);
            $('.price').eq(i).html('가격 : '+products[i].price);
            }
        });

        let newArray = array.filter(function(a){   // 신문법은 new에 담아서 사용해야함.
            return a < 4; // 조건식. a<4를 쓰면 4보다 작은것만 걸러진다.
        })

        // filter()함수는 기존 array자료를 변형 시키지 않는다
        // sort()함수는 기존 array 자료를 변형 시킨다

        // let newArray = array.map(function(a){
        //     return a * 2 // array자료에 전부 뭐 해주고 싶으면 map()함수 사용. array자료에 전부 2를 곱해준다.
        // })

        // 가나다순으로 정렬하는 코드
        $('#abc').click(function(){
            products.sort(function(a,b){
                if(a.title < b.title === true) {
                    return -1;  // 음수를 리턴하면 b.title을 오른쪽으로 보낸다.
                }
                else {
                    return 1;  // 양수를 리턴하면 b.title이 왼쪽으로 온다.
                }
            });

            for(let i =0; i < products.length; i++){
            $('.title').eq(i).html(products[i].title);
            $('.price').eq(i).html('가격 : '+products[i].price);
            }
        });

        // 6만원이하 필터 기능
        $('#filter').click(function(){
            let newProducts = products.filter(function(a){
                return a.price <= 60000
            });

            newProducts.forEach(function(a){
                let template = `<div>${a.title} ${a.price}</div>`;
                $('.card-group').append(template);
            });
        });

        // AJAX
        $('#ajax').click(function(){
            $.ajax({ 
                url : 'https://codingapple1.github.io/hello.txt',
                type : 'GET'
            }).done(function(데이터){
                // console.log(데이터);
                $('#hhello').html(데이터);
            });
            // .fail(function(){      //ajax 요청이 실패했을 때 실행할 코드

            // }).always(function(){     //ajax 요청시 항상 실행할 코드

            // })
        });

        // AJAX 이용해서 상품 변경하기
        $('#change').click(function(){
            $.ajax({ 
                url : 'https://codingapple1.github.io/data.json',
                type : 'GET'
            }).done(function(데이터){
                // console.log(데이터);
                $('#car').html(데이터.brand);
                $('#kind').html(데이터.model);
                $('#money').html(데이터.price);
                $('#picture').attr('src', 데이터.img);
            });
        });
