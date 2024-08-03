import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";

function useBacklinkNavigation(content) {
  const navigate = useNavigate();
  const handleNavigate = useCallback((e) => {
    e.preventDefault();
    const navPath = e.target.getAttribute('href')
    navigate(navPath)
    window.scrollTo(0, 0)
  }, [navigate]);
  useEffect(() => {
    const backlinks = document.querySelectorAll('.backlink');
    backlinks.forEach(link => {
      link.addEventListener('click', handleNavigate);
    });
    return () => {
      backlinks.forEach(link => {
        link.removeEventListener('click', handleNavigate);
      })
    };
  }, [handleNavigate, content]);
}

export default useBacklinkNavigation;