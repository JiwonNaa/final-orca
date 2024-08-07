package com.groupware.orca.board.mapper;

import com.groupware.orca.board.vo.CommentVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {

    @Select("SELECT LEVEL AS COMMENT_LEVEL, " +
            "c.BOARD_CHAT_NO, c.CONTENT, c.BOARD_NO, c.INSERT_USER_NO, " +
            "TO_CHAR(c.ENROLL_DATE, 'YYYY-MM-DD HH24:MI:SS') AS ENROLL_DATE, " +
            "c.IS_ANONYMOUS, c.REPLY_COMMENT_NO, " +
            "CASE WHEN c.IS_ANONYMOUS = 'Y' THEN '***' ELSE e.NAME END AS EMPLOYEE_NAME, " +
            "CASE WHEN c.IS_ANONYMOUS = 'Y' THEN '***' ELSE t.TEAM_NAME END AS TEAM_NAME " +
            "FROM BOARD_COMMENTS c " +
            "JOIN PERSONNEL_INFORMATION e ON c.INSERT_USER_NO = e.EMP_NO " +
            "LEFT JOIN DEPARTMENT_TEAM t ON e.TEAM_CODE = t.TEAM_CODE " +
            "WHERE c.BOARD_NO = #{boardNo} " +
            "START WITH c.REPLY_COMMENT_NO IS NULL " +
            "CONNECT BY PRIOR c.BOARD_CHAT_NO = c.REPLY_COMMENT_NO " +
            "ORDER BY COMMENT_LEVEL, ENROLL_DATE")
    List<CommentVo> getCommentsByBoardNo(@Param("boardNo") int boardNo);

    @Insert("INSERT INTO BOARD_COMMENTS(BOARD_CHAT_NO, CONTENT, BOARD_NO, INSERT_USER_NO, ENROLL_DATE, IS_ANONYMOUS, REPLY_COMMENT_NO) " +
            "VALUES (SEQ_BOARD_COMMENTS.NEXTVAL, #{content}, #{boardNo}, #{insertUserNo}, SYSDATE, #{isAnonymous}, #{replyCommentNo})")
    @Options(useGeneratedKeys = true, keyProperty = "boardChatNo", keyColumn = "BOARD_CHAT_NO")
    int insertComment(CommentVo commentVo);

    @Update("UPDATE BOARD_COMMENTS SET CONTENT = #{content}, MODIFY_DATE = SYSDATE WHERE BOARD_CHAT_NO = #{boardChatNo}")
    int updateComment(CommentVo commentVo);

    @Delete("DELETE FROM BOARD_COMMENTS WHERE BOARD_CHAT_NO = #{boardChatNo}")
    int deleteComment(@Param("boardChatNo") int boardChatNo);

    @Delete("DELETE FROM BOARD_COMMENTS WHERE BOARD_NO = #{boardNo}")
    int deleteCommentsByBoardNo(int boardNo);

    @Select("SELECT CATEGORY_NO FROM BOARD WHERE BOARD_NO = #{boardNo}")
    int getCategoryNoByBoardNo(@Param("boardNo") int boardNo);
}
