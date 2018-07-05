# Proj_SoSo

## 2018.07.04 Developing Note
* * *

#### 1. 로그인 기능의 추가 . -> 몽고디비를 활용하여 저장, 비교하는 기능 구현
> 추가할점) 비밀번호를 암호화 하여 db에 저장해야함.

#### 2. 게시판 기능의 추가 . -> 글 작성, 저장하되 글 스키마에 유저아이디 속성을 두어 작성자를 비교함.
> 추가할점) 추천수 기능이 필요할지도 모름, 또는 여러가지 기능이 필요할지도모름. 일단은 스키마를 간단하게 설정하되 나중에 추가사항에 따라 스키마를 변경하여야함.

#### 3. 게시판 글들의 목록 -> 글을 눌렀을때 그 글들만의 각각 페이지로 구현해야함. 거기에 들어가야함. 동적으로 EJS가 필요할듯.
 
#### 4. EJS 템플릿 공부 -> EJS를 어느정도 사용하여 동적인 뷰파일, 게시판 글 목록들을 구현하는 것을 공부하였다. 좀더 공부하여 여러가지 기능을 구현할 수 있을 수준이 되어야함.

* * *
## 2018.07.05 Developing Note

##### 1. 회원가입의 비밀번호를 암호화하여 db에 저장하는 기능 구현.

#### 2. 글 목록에서 제목을 눌렀을때 글만의 페이지로 이동하는 기능 구현.

#### 3. 댓글기능 구현.

#### 4. 댓글, 글들의 삭제기능 구현. 현재 세션의 사용자와 비교하여, 작성자만 삭제 할 수 있게끔 구현 완료.
> 추가할점) 게시판글 ,제목, 댓글의 수정기능 구현.
#### 5. 게시판 글들의 스키마 수정, 다듬음 추천수 기능 구현을 위해 스키마 수정. 추후 구현 예정.

#### 6. EJS 템플릿에 대한 이해 수준이 올라감. 동적으로 게시판을 보여주는 페이지 구현, 그리고 하나의 EJS파일로 모든 게시글의 자체 페이지 구현 완료하였음.

#### 7. 라우트 정리, 코드정리 할 필요 있음.