import React, { Component } from 'react';
import htmlToReact from 'html-to-react';
import { Link } from "react-router-dom";
import TableBooks  from './Table';
import records from '../data/records.json';
import '../styles/Books.scss';

const htmlToReactParser = new htmlToReact.Parser();
export default class Books extends Component {
  constructor(props){
    super(props);
    this.state = {
    searchvalue : '',
    data: [],
    currentPage: 0,
    pageSize: 5,
    listLength:''
    }
    this.renderPageList=this.renderPageList.bind(this);
    this.pageNav=this.pageNav.bind(this);
  }
  
  componentDidMount(){
      setTimeout( () =>{
        
        this.setState({
              data: records.GoodreadsResponse.search.results.work,
              listLength:records.GoodreadsResponse.search.results.work.length,
              currentPage: 1,
            })
          const elem=document.querySelectorAll('.page-list')
      Array.from(elem).forEach(link => {
        link.addEventListener('click', this.pageNav);
     });
                

      }, 1000);
      
      //console.log(records.GoodreadsResponse.search.results.work.length)
      //this.renderPageList()

  }
  
  onChaneText =(e) =>{
    const { value } = e.target;
    this.setState({
      ...this.state,
      searchvalue: value,
    })
  }
  onNextPrev = (page) =>{
    const { pageSize, data, currentPage } = this.state;
    const newPage  = page === "next" ? currentPage + 1 : currentPage - 1;
    if(newPage >0 && (Math.ceil(data.length / pageSize) >= newPage)){
      this.setState({
        ...this.state,
        currentPage: newPage,
      })
    }
  }
  pageNav(e){
    
    const { pageSize, data, currentPage } = this.state;
    console.log(e.target)
    const newPage  = currentPage <= e.target.innerText ? currentPage + 1 : currentPage - 1;
    //if(newPage >0 && (Math.ceil(data.length / pageSize) >= newPage)){
      const elem=document.querySelectorAll('.page-link.page-list')
      Array.from(elem).forEach(link => {
        link.setAttribute('class', '');
     });
      e.target.setAttribute('class','page-list page-link');
      this.setState({
        ...this.state,
        currentPage: e.target.innerText,
      })
      //this.renderPageList();
    //}
  }
  renderPageList(){
    let { pageSize, data,listLength, currentPage } = this.state;
    let list ='';
    console.log(currentPage)
    let lengthVal = data.length / pageSize;
      for (let i=1;i<=lengthVal;i++){
        if(i === currentPage && i === 1){
          list += `<li className="page-link page-list" >${currentPage}</li>`

        }else{
          list += `<li className="page-list">${i}</li>`
        }
        //list += `<li className='page-link'>${i==currentPage?currentPage:currentPage++}</li>`
      }
      //console.log(list)
      return <ul>{htmlToReactParser.parse(list)}</ul>
    //return Parser('<ul>{list}</ul>')
      
  }
  render() {
    const { searchvalue, currentPage, pageSize, data } = this.state;
    const tableProps = {
      data,
      searchvalue,
      pageSize,
      currentPage,
    };
    const isNext = Math.ceil(data.length / pageSize) > currentPage;
    const isPrev = currentPage > 1;
  
    return (
      <div>
       <div className="headerNav">
            <Link to="/">Todo App</Link>
        </div> 
      <div className="booksWrapper">
        <div className='container'>
          <div className='row'>
          <div className="col-lg-12 center-block text-center">
          <header>
            <h3>Books List</h3>
          </header>
            <div className="searchContainer">
              <input type="text" 
                className='search-box' 
                value={searchvalue} 
                onChange={this.onChaneText}
                placeholder='Search by Book Name...'
                />
            </div>
            <TableBooks {...tableProps} />
          <nav  aria-label="Page navigation example">
            <ul className="pagination pagination-lg">
              <li className="page-item">
                <div className={`page-link ${!isPrev && 'disabled'}`} aria-label="Previous" onClick={(e) => this.onNextPrev('prev')}>
                  <span aria-hidden="true">«</span>
                  <span className="sr-only">Previous</span>
                </div>
              </li>
              <li className="page-item active">
                {this.renderPageList()}
              </li>
              <li className="page-item">
                <div className={`page-link ${!isNext && 'disabled'}`} aria-label="Next" onClick={(e) => this.onNextPrev('next')}>
                  <span aria-hidden="true" >»</span>
                  <span className="sr-only">Next</span>
                </div>
              </li>
              </ul>
          </nav>
        </div>
          </div>
        </div>
      </div>
      </div>
    )
  }
}
