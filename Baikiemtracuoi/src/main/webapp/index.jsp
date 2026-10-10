<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    // Forward root request to products servlet
    response.sendRedirect(request.getContextPath() + "/products");
%>
