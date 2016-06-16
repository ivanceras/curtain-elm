

## freeze column
http://stackoverflow.com/questions/20759920/html-table-with-fixed-header-column-and-row-without-js
http://jsfiddle.net/GnN66/2/


## table tbody scroll
http://jsfiddle.net/f2XYF/16/

## my fork
http://jsfiddle.net/q56sLg3t/



##style.css

```css

.table-container {
    position: relative;
    width: 600px;
    height: 100%;
    border: 2px solid red;
    display: inline-block;
}
table {
    float: left;
}
th {
    border: 1px solid black;
    padding: 10px;
}
td {
    border: 1px solid black;
    padding: 10px;
    margin: 0;
    white-space: nowrap
}
.right {
    overflow: auto;
}

tbody{
   display:block;
   height:400px;
   overflow-y:scroll;
}
thead{
  display: block
}

thead th{
  width:200px;
}

tbody td{
  max-width:100px;
  overflow:hidden;
}


```

## html

<div class="table-container">
    <div class="headcol">
        <table>
            <thead>
                <th>Room</th>
            </thead>
            <tbody>
                <tr>
                    <td>Fooname</td>
                </tr>
                <tr>
                    <td>Barname</td>
                </tr>
                <tr>
                    <td>Barfoo</td>
                </tr>
                <tr>
                    <td>Zorzor</td>
                </tr>
                <tr>
                    <td>Lorname Ipsname</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="right">
        <table>
            <thead>
                <th>8-10</th>
                <th>10-12</th>
                <th>12-14</th>
                <th>14-16</th>
                <th>16-18</th>
                <th>18-20</th>
            </thead>
            <tbody>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                <tr>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                </tr>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                <tr>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                </tr>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                </tr>
                <tr>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell booked">Already booked</td>
                    <td class="cell available">Available for booking</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```

## nice freeze column, but the bottom scroll bar need to be shown
http://codepen.io/saiidi/pen/mePdqo

