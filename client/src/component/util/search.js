import { useState } from "react";
import AdvanceBar from "../search-bar/advance_bar";
import Bar from "../search-bar/bar";

export function SearchBar(props) {
    const [advance, setAdvance] = useState(props.advance);
  
    const handleAdvance = () => {
      if(advance) setAdvance(false);
      else setAdvance(true);
    }
  
    return (
      <div className='searching'>
          <table>
            <tr>
              <td><h1>Home Page</h1></td>
              <td className="ad_search"><input type="checkbox" checked={advance} onChange={handleAdvance}/> advance</td>
              <td>
              {advance ? <AdvanceBar/>: <Bar/>}
              </td> 
            </tr>
          </table>
        </div>
    )
  }