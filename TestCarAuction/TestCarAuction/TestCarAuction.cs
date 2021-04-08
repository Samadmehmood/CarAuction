using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
namespace TestCarAuction
{[TestFixture]
    public class Tests
    {

        IWebDriver driver;
        DirectoryInfo basepath = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.Parent.Parent;
        [OneTimeSetUp]
        public void Setup()
        {
           
            
         
        }
        
        [Test]
        public void TestEmailTextbox()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";
            IWebElement createLink = driver.FindElement(By.Id("createLink"));
            createLink.Click();
            IWebElement tb = driver.FindElement(By.Id("email"));
            tb.SendKeys("a@a");
            IWebElement submitBtn = driver.FindElement(By.Id("submitBtn"));
            submitBtn.Click();
            IWebElement validity = driver.FindElement(By.Id("emailValidity"));
            Thread.Sleep(700);
            string bc = validity.GetCssValue("display");

            if (!string.IsNullOrEmpty(bc) && bc== "block") 
            {
                Assert.Pass();

            }
            else { 
                Assert.Fail(); 
            }
        }
        [Test]
        public void TestEmailTextboxInvalid()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";
            IWebElement createLink = driver.FindElement(By.Id("createLink"));
            createLink.Click();
            IWebElement tb = driver.FindElement(By.Id("email"));
            tb.SendKeys("a@");
            IWebElement submitBtn = driver.FindElement(By.Id("submitBtn"));
            submitBtn.Click();
            IWebElement validity = driver.FindElement(By.Id("emailValidity"));
            Thread.Sleep(700);
            string bc = validity.GetCssValue("display");

            if (string.IsNullOrEmpty(bc) || bc == "none")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [Test]
        public void TestPhoneTextbox()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";
            IWebElement createLink = driver.FindElement(By.Id("createLink"));
            createLink.Click();
            IWebElement tb = driver.FindElement(By.Id("phone"));
            tb.SendKeys("123-456-7890");
            IWebElement submitBtn = driver.FindElement(By.Id("submitBtn"));
            submitBtn.Click();
            IWebElement validity = driver.FindElement(By.Id("phoneValidity"));
            Thread.Sleep(700);
            string bc = validity.GetCssValue("display");

            if (!string.IsNullOrEmpty(bc) && bc == "block")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [Test]
        public void TestPhoneTextboxInvalid()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";

            IWebElement createLink = driver.FindElement(By.Id("createLink"));
            createLink.Click();
            IWebElement tb = driver.FindElement(By.Id("phone"));
            tb.SendKeys("1234567890");
            IWebElement submitBtn = driver.FindElement(By.Id("submitBtn"));
            submitBtn.Click();
            IWebElement validity = driver.FindElement(By.Id("phoneValidity"));
            Thread.Sleep(700);
            string bc = validity.GetCssValue("display");

            if (string.IsNullOrEmpty(bc) || bc == "none")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [Test]
        public void TestPostalCodeTextbox()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";

            IWebElement createLink = driver.FindElement(By.Id("createLink"));
            createLink.Click();
            IWebElement tb = driver.FindElement(By.Id("postalCode"));
            tb.SendKeys("A1A 1A1");
            IWebElement submitBtn = driver.FindElement(By.Id("submitBtn"));
            submitBtn.Click();
            IWebElement validity = driver.FindElement(By.Id("postalCodeValidity"));
            Thread.Sleep(700);
            string bc = validity.GetCssValue("display");

            if (!string.IsNullOrEmpty(bc) && bc == "block")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [Test]
        public void TestPostalCodeTextboxInvalid()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";
            IWebElement createLink = driver.FindElement(By.Id("createLink"));
            createLink.Click();
            IWebElement tb = driver.FindElement(By.Id("postalCode"));
            tb.SendKeys("abc0h1");
            IWebElement submitBtn = driver.FindElement(By.Id("submitBtn"));
            submitBtn.Click();
            IWebElement validity = driver.FindElement(By.Id("postalCodeValidity"));
            Thread.Sleep(700);
            string bc = validity.GetCssValue("display");

            if (string.IsNullOrEmpty(bc) || bc == "none")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [Test]
        public void TestHomeLink()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";
            IWebElement link = driver.FindElement(By.Id("homeLink"));
            link.Click();
            Thread.Sleep(700);
            IWebElement ContentDiv= driver.FindElement(By.Id("listDetails"));
            string bc = ContentDiv.GetCssValue("display");

            if (!string.IsNullOrEmpty(bc) && bc == "block")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [Test]
        public void TestCreateLink()
        {
            driver = new ChromeDriver(basepath + "\\webdriver");
            driver.Url = basepath + "\\index.html";
            IWebElement ContentDiv = driver.FindElement(By.Id("forms"));
            IWebElement link = driver.FindElement(By.Id("createLink"));
            link.Click();
            Thread.Sleep(700);
            string bc = ContentDiv.GetCssValue("display");

            if (!string.IsNullOrEmpty(bc) && bc == "block")
            {
                Assert.Pass();

            }
            else
            {
                Assert.Fail();
            }
        }
        [TearDown]
        public void close_Browser()
        {
            driver.Close();
        }
    }
}