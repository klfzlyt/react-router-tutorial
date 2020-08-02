import React,{useEffect} from 'react'

export default function(pageComponent) {
    const Cls = pageComponent;
    return props => {
      const wrapDiv = React.useRef<HTMLDivElement>();
      function focus() {
        wrapDiv && wrapDiv.current && wrapDiv.current.focus();
      }
      useEffect(() => {
        // 挂载时聚焦
        alert('focused')
        focus();    
      }, []);
      return (
        <div ref={wrapDiv} tabIndex={-1} style={{ outline: "none" }} role="group">
          <Cls {...props} />
        </div>
      );
    };
  }
  
  