<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
        <!DOCTYPE html>
        <html>

        <head>
            <meta charset="UTF-8">
            <title>Home</title>
            <!-- 파비콘 -->
            <link rel="icon" href="img/logo.png" type="image/png">
            <link rel="stylesheet" href="/css/managementSupport/main.css">
            <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
            <script defer src="/js/managementSupport/main.js"></script>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <link rel="stylesheet" href="/css/salary/write.css">
        </head>

        <body>
            <header>
                <div class="header-left">
                    <img src="" alt="Logo" class="logo">
                    <h2 class="header-title">ORCA</h2>
                </div>
                <div class="header-right">
                    <span class="icon">알림</span>
                    <span class="icon">조직도</span>
                    <span class="icon">설정</span>
                </div>
            </header>

            <button id="toggleSidebar" class="sidebar-toggle" onclick="toggleSidebar()">메뉴</button>
            <aside id="sidebar" class="sidebar">
                <div class="profile" onclick="toggleProfile()">
                    <img src="profile.png" alt="Profile Picture" class="profile-pic">
                    <p class="profile-info">회계 1팀 | <span>양파쿵야</span></p>
                </div>
                <hr>
                <nav>
                    <div class="sidebar-nav">
                        <div class="approval title-toggle">◾ 급여 관리</div>
                        <div class="approval-list">
                            <div class="toggle">◽ 급여 입력</div>
                            <div class="toggle">◽ 급여 목록</div>
                        </div>
                        <div class="calnedar title-toggle">◾ 4대보험</div>
                        <div class="calendar-link link">
                            <div class="calendar-list toggle">◽입력 - 수정</div>
                            <!-- <div class="calendar-wirte toggle">◽ 조회</div> -->
                        </div>
                    </div>
                </nav>
            </aside>
            <main>
                <div class="main" id="content">
                    <h1>급여 입력</h1>

                    <form action="/salary/write" method="get">
                        <pre>사원번호</pre><input type="text" name="empNo" >
                        <br>
                        <pre>직급수당</pre><input type="text" name="position" >
                        <br>
                        <pre>상여금</pre><input type="text" name="bonus" >
                        <br>
                        <pre>식대</pre><input type="text" name="meals" >
                        <br>
                        <pre>휴일근무수당</pre><input type="text" name="holidayTime" >
                        <br>
                        <pre>연장근무수당</pre><input type="text" name="overTime" >
                        <br>
                        <pre>자녀 수</pre><input type="text" name="person" >
                        <br>
                        <input type="submit" name="작성하기">
                    </form>
                 
                </div>
            </main>
        </body>

        </html>