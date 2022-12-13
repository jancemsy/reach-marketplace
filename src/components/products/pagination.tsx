import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';
import { getURLParam } from '../../helpers/common';


function PaginatedItems({ totalPages, currentPage,   Navigate }) {
  let is_set = false;
  const isSet = () =>{
    is_set = true;
  }

  const handlePageClick = (event) => {
    if(is_set){
        const type = getURLParam("type") || 1;
        const page = event.selected + 1;
        const url  = `/products?type=${type}&page=${page}`;
        Navigate(url);
    }
  };

  return (
    <PaginationContainer>
      <ReactPaginate
       initialPage = {currentPage - 1}
        breakLabel="..."
        nextLabel="next >"
        onClick={() => isSet()}
        onPageChange={(e) => handlePageClick(e)}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        containerClassName={'pagination'} /* as this work same as bootstrap class */
        subContainerClassName={'pages pagination'} /* as this work same as bootstrap class */
        activeClassName={'active'}
      />
    </PaginationContainer>
  );
}

export default PaginatedItems;

const PaginationContainer = styled.div`
.pagination {
  display: flex;
  padding-left: 0;
  list-style: none;
}
.pagination li a{
  padding: 0.375rem 0.75rem;
}
.pagination li a{
  position: relative;
  display: block;
  color: #0d6efd;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #dee2e6;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.pagination li.active a{
   background:#0d6efd!important;
   color:#fff;
}

.pagination li.disabled{
  opacity:0.3;
}

`;