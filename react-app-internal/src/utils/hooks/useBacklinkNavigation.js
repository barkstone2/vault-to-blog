import {useNavigate} from "react-router-dom";
import {useCallback, useEffect} from "react";

function useBacklinkNavigation(content, onTagSelected = () => {}) {
  const navigate = useNavigate();
  const handleNavigate = useCallback((e) => {
    e.preventDefault();
    const link = e.target.closest('.internal-link');
    const navPath = link?.getAttribute('href');
    if (!navPath) {
      return;
    }
    navigate(navPath)
    document.querySelector('.markdown-preview-view').scrollTo(0, 0);
  }, [navigate]);

  const handleTagSearch = useCallback((e) => {
    e.preventDefault();
    const tagElement = e.currentTarget;
    const tagValue = (tagElement.getAttribute('data-tag-value') || tagElement.textContent || '').trim();
    if (!tagValue) {
      return;
    }
    onTagSelected(tagValue);
  }, [onTagSelected]);

  useEffect(() => {
    const backlinks = document.querySelectorAll('.internal-link');
    backlinks.forEach(link => {
      link.addEventListener('click', handleNavigate);
    });

    const tags = document.querySelectorAll('.metadata-property[data-property-type="tags"] .multi-select-pill');
    tags.forEach((tag) => {
      tag.addEventListener('click', handleTagSearch);
    });

    return () => {
      backlinks.forEach(link => {
        link.removeEventListener('click', handleNavigate);
      })

      tags.forEach((tag) => {
        tag.removeEventListener('click', handleTagSearch);
      });
    };
  }, [handleNavigate, handleTagSearch, content]);
}

export default useBacklinkNavigation;
