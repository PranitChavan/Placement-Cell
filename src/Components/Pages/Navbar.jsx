import React from 'react';
import Logout from '../Auth/Logout';
import Login from '../Auth/Login';

export default function Navbar({ loggedInOrNot }) {
  return (
    <nav className={`navbar navbar-expand-lg bg-dark`}>
      <div className="container-fluid ">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXwBFRcXHhoeOyEhO3xTRlN8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fP/AABEIAIIAbwMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAgMEBQYBB//EADoQAAIBAwEFBQYEBQQDAAAAAAECAwAEESEFEhMxQSIyUWFxBhSBkaGxQnLR8CNiksHhFVJT8TNDgv/EABkBAAMBAQEAAAAAAAAAAAAAAAADBAIBBf/EADARAAICAQMDAgQFBAMAAAAAAAABAgMREiExBCJBE1EyYXGxI0KBkaHB0eHwFCQz/9oADAMBAAIRAxEAPwDZ0AFACZHWNGd2CqoySegoAyu0L+COQXN3xA0x7AQkMiDl+/OvPc7bbH6T2RV2wWGKt9sqccDaYPgs/wDnBrXqXw+KJzFciwTat2AC0UMo8VYj9a2uqj5Rz0fZjg20R37Rx6ODTF1EDPosDtxelrN8Sv61314B6LG323Ke5agfmk/QVx3xOqlkG525MNJbqK3HgnP661n1Zy+FGvThHk7snaKCYTiZpIZDuSM5JIPQ6/vWuQnJT0zOSipRzEvL9nVEKMV7WuM4Oh5kZx6/DrVROQzNd7kgHGG+qlMpqmFBPTrnHzoAt6ACgBqe4itozJM4RfPrXG8cnUm+Cj2jtJZIjLcZitFOQh70h6af2qG26Vj9OrkfGCgtUjG39499dNNJpnRV/wBoqqqtVR0oVKWp5I9MMnUZozlGK/lOKGk+TuR4Xt0vK5lH/wBmsenD2O6pe50392edzJ/VR6cPYNcvcaeeZ+/LI3qxrSilwjmWN104TNnXvucp3xvQvo6/3pVtetbcm4S0s2ez9piCJFkJltiOxKupUeB8R50uu/fTPZm5153iXUUiTRiSJg6NyI5GqhDWBdABQBGvrYXds0egbmjeDdDWZJSWGai9LyYf2ghZhBc9rBzGyE9xh+z8qj6V6XKp8obbviRS1aJJFrZyXSuyFFVMDLnAJ8K4284Sy/kcbSWW8Cn2beIM8BnHjGQ/2zWHZFcvH12+5pLPG5HaKRe9G6/mUitqUXwwwzgRm5Kx9BRlIB+Owu5dUtpMeLDdHzOKx6sM4z/X7BhiLm2ktXCS7uoyCpyCPWtqWTn0Gq6BofZ+CUWvZYhrh92MdB4t9/lUVqVtqh7cj6+2LkbaCFLeFIoxhUGBVq2EN5HK6cCgAoAzHtDbZjvYgNGUTr6jn9vrUVvZfGfvsPj3VtGQtLc3VwkIdULZ1Plr8TVUpaVkSXywJHGsUQIjXlnmT4nzq6ir002+XyeddY7H8jojxy0p732YlLHAsNKOUr/1GlOiqXMV+wxWWLhs7vzH/wBr/wBVZXT0riC/Y67bH+ZiGRmOWJPqc05JR4WBby+RE1qtzDwZNNcowGSp/TyqbqKs/iR5X8r/AHgpos0dr4M/LG0crx5DMrFeycgnlpUsWpLJc1jY3uw7YJMFHdt4gg9TzP0+tTdN3OU35G27JRLyqxAUAFABQBU7XQNcQ/zxup+lRdZ8KfzH0+UedQyNEY5EPbQhh6irJRUsp+RKeDXhVcB07rAMvodarom51pvkhshpm0jvDpuTGA4dGQwHDoyGA4dGQwNXTe7Ws0w0ZEJX83IfUipupl2affb+/wDA6iOZ59jM2a715br4yoPqKlsfY38mWR5R6JsYfwp28ZfsBS+m/wDJG7viLKqBQUAFABQBUbYcLcQ/yxux+lR9X8KXzH0+WedL3R6VYJNlsxC2zLUn/iX7Uzp32v6v7iLl3ErhU/IrAlgi95gPjWJWwjyxkaZy4RwGNtAwrivreyZ2XT2R3aF8KmZFaSu2+pTZUnmyg/Opr3mUP1+w+lYyZq0bdvLdj0lQ/UUmzeD+jHR5R6Lsc/w516iX7gUrpXmpDLviLGqRIUAFABQBl/aG5AS9kB7qCBfU8/v9Kjs774x9tx8e2tsxZOATVgk9DsbQwWNvERqkag/Kih9mfff9xdi7iLezESGJDgL3j51P1Fzb0ou6ahJa5ESoy4KDhKs58OI35NoD4VXRe4vTLgj6jp1Jao8nfaC1Mmx7jH4AH+RzVN35X8/vsQ1+TDajUHB6GuGz0DYtyHmVh3bmIOPUf4P0qPpXpcq34Y63dKReVaICgAoAj3tx7rbNIBvNyUeLHQVmUlFZZqK1PBhNv3HaitFbeKduQ+LH95+NS9MnJu1+Rtr/ACoj7BsxfbWhiYgKp328wKfa+3C87Clzk9HEYpq2WDGDLO2+7MfxEmvMe7yeylhYE1w6FAHDJG5/guG0+Rpk44eUKrbaxI1HCWa3AcaOuo9RV0lrhh+TzMaZHmd9be53s1vnPDbAPl0rMJaops61hl17P3TG3MSnM1u3EiHiOo+4+NS3fhWqzw9mOh3RcWbaCVZ4UljOVcZFXIQ1gcoOCWdUGWIA8643jkCNtJONs+YJ2mC7y48RqPtXJLVFo1F4eTBbfjC3wmXuzIGHry/Spulf4el+BlqxIj7Ku/cdpW9xnCq3a9DoafYm47ci1yenqQygjka2mpLKM8GVuY+DcSRnTdY49K86S0yaPWhLVFMarJsDXTpXbI1keEkAtgZ+lVXrVgh6eWnVnwbqeeO2tHlLDciUkn0p05aY5RIt2eXTytcTyTP3pGLH40RjpikdbyW3s/EQt1cgZKrw082P7HzqXqu5xr92Nq8s3kKpbW8ceQFRQup8Ks4EvdjqsGGVIIPUV04NXScSLH8w+9Kuhrg4movDyRLuQRAKmhHUVFZY4tQgx0IqW7Mvti1LWDDHbtm3h+Q/4+1apmvUz4l9zVizH6Gcq8mNfsn2hkXZKRLC09zGwjAB6HkT++dLj2y0+PH9jst1kVdx3c6e8G2uTKWO+CUCxgfvnRZXq3Q2m7QsMqztFUY5DkeY50r0Gyj/AJMV4O+9GUb+4/DB1IHI9B51z0tO3k0rsrVjY5seZLfabNcRyZGeyuMg55a/bxqrTxnwQa3vjySvam8iQe7QxmOWQZlOdd3mAcUv45fJff8AwHC+pmOVMOGz2PYmJLW2xhl/jS+R6D5/avPg/Utc19EUfDDBaXkg3txAPXrS77NcseEdrjhZLC3XcgjXwUV6cVhJEzeWcmfskdBzNZsmoRydisso7u4czZQKx/mrzIQ1pyb5K+NkRXnuZp1MtqgTdKsUfOR5g4prUFDCZxZzuZq+sntJ3UI5i5q26cY9atrsU1nyTSjpYzaXTWs6yxlWI5qeTDwNalHUsHE8Gn/1G4ura5uokiuYT22WSQjh4A5ryJ+9chPPbLk5JY3Q3tiG+lkF3JEsccMZJEk29kYydNPSmmckW3mnsoUt+HBv7wmj31JbewNMdSdKAGluGs5Z7qcq5lLbgIxxDvZ3h4AEZzSpScnoj+r9v8mkvLKmWZ7idpJG35XOSepNaUVFYQZyWexdmSz3iySwSiKPtaoRvHoP71P1FmIaYcsZBb7mos02nG8re6wxiRtWkl7WOgwM1iMYwhhM1KWpj8cLGchyGOmSBpUTjlqMRmrtLGKUNlM6rp616tdqnx4JnHASW4kUjeZQaLKo2LDCMnF5KW7txDcbobe0FR2xVTwiiEnLc4iVFOY0aSeRrq4gjCcSJQyRNzkGOYPrpyNMjSpRjJ+f4FubTaJ94LS1txLdwI67wBygOB1PoBrVtNbQmUhN5Bs2wTeFjGBIwjPDRRne0weVMnJP9DKRD3LESNGlsUkiAbhk8gc6jXHPNSWXW7NPZjYwj7EWV7N7Vb14WeNRvKTqQPEZNMh62rEpGsQxnA9PFaQRm5uLdCRjJKBmH/XP4VP6k5y9ODNPSllol3Dixt1liijKl1U4OMBiBnQa865VW5vEmYlLHBImuJbF4jcIjQSOIy6ZBQnlkHp51XCuOBTkx+abGgqS24bCAm0Bkd8HBx4Uzo4qxSyct2wS44Fj6k16FdUa1iIlyb5HqaZKu8tpWuGkC5U8sVB1NNk5Zih9c4pYY3FF2sEY8jXnqmbfchzmvAibZ09wkAYIJopFZZw2qgHXTxI0xyr1aoKO64JpPI7cRtdccS70SMpiCkA5U8z8f7CuztUeDijkqLiaeXZlkkyScZJoxJ2Tnstq3LlpmpnJepLD8Mal2oLcmO5mW4y0pGkx5OnQeAI8PjRpWlPx7fM2tm8kQW7n2bIzLv8ACxw8a58MYzXXb/2EvBnHYXm4Z7lUXuqu8d6MkHOmOnTPzqeqvSssJSyMe53H+kXuzjG7bilbeQ6BhzUa+B0+FXdqamxO/BIveJeLEkqiONXV3BOWYg5A00Az1qWy9QzgZGDYokufGoFCc3ssj8pEuxjkWQsykAjrXp9HTZW25LkRbJS4J1eiICgAoASyq3eAPqKAE8FOmR6HFcwmA29qrDvuPlSpUQlybU2ilvYry0JZ92SH/kVTp6jOlTPpYw3iPhZq2K6a8v4u1DBFOnipIPyrLhCe0ng1JzXG5Itr+93eJcxwQL4ZJP3pLqrTxDLBan8RbWXv1wwdgkMPmh329BnT41ZVRj4hM5LwWBgDd52NPdUHyhWpnBbRD8GfXWhVQXCDUx0KF5AD0phw7QAUAFABQAUAJeRY13nZVHiTigDoORmgDtAFdcbHt5WLxEwOeqcj6jlS5VxlyMjZJDlrsu3tiHwZJB+N9SPTwrsYRjwclNyJaOsihkIZSMgg5BrZgVQAkyKHCFgGIyFzrigBVACSyhgpIBPIZ50AKoAr9pGfIW2eRZGViCBlRgffOKAGxHd9g8WXdMhDEtrjeIGmOWMa0AObOS53G97d+JuqCN4EA4GTyHXNAEQR3bohk47SRHHaxhiEbJGnInSgBRivYrf+G8mBxAQvMdo7uPLH71oAUUvvwyTnQkdoZJ3iMajTTHXWgDm5fDczJNu8TdZt4A/+THLH+2gCTfR3RYe7SFRuH5/v5+VAEVo7yOGPgNLrLhhpoC4+QxnXBoAn27NLaYJcShRvBjqrEZxnHnQBXxQ3TyRPMZVfC7xDZ17Wdd3z+tAD1it7x4/eXlGF7Q3gRnC9ceJNAHLm2na/iOXZA2UdcZTIOQT4cunWgB/ZwuRxvemcsGAUEADGBy1PXPWgCdQAUAM4AugQNShz560APUAFABQAxeAe6TeSE/SgB4UAdoA5gCgDtABQAUAFAH//2Q=="
          className="rounded float-start me-2"
          style={{ height: '50px', width: '50px' }}
        ></img>
        <a className="navbar-brand text-warning fw-bold" href="/">
          Placement Cell
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon bg bg-light"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"></li>
          </ul>
          <div className="nav-item mt-2 me-3 text-success float-end"></div>
          <i className="fa-sharp fa-solid fa-magnifying-glass text-primary mx-2"></i>

          {loggedInOrNot ? <Logout /> : <Login />}
        </div>
      </div>
    </nav>
  );
}
